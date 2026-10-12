import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { fetchKitchenOrders, sendKitchenChat, updateKitchenStatus } from "../api/kitchen.api";
import type { KitchenChatMessage, KitchenCommandResult, KitchenOrder, KitchenStatus } from "../components/kitchen/kitchen.types";
import { summarizeOrders } from "../components/kitchen/kitchen.utils";
import { KITCHEN_GREETING } from "../mocks/kitchen.mock";

type NewMessage = KitchenChatMessage extends infer M ? (M extends unknown ? Omit<M, "id"> : never) : never;

interface KitchenState {
    orders: KitchenOrder[];
    messages: KitchenChatMessage[];
    isLoading: boolean;
    loadError: string | null;
    isSubmitting: boolean;
    loadOrders: () => Promise<void>;
    setStatus: (orderId: number, status: KitchenStatus) => Promise<void>;
    sendMessage: (text: string) => Promise<void>;
}

let nextMessageId = 1;
const withId = (message: NewMessage): KitchenChatMessage => ({ ...message, id: nextMessageId++ });

const botText = (text: string): NewMessage => ({ sender: "bot", kind: "text", text });

export const useKitchenStore = create<KitchenState>()(
    devtools(
        (set, get) => {
            const append = (message: NewMessage, label: string) =>
                set((state) => ({ messages: [...state.messages, withId(message)] }), false, label);

            /** Re-reads the queue without toggling the initial-load state. */
            const refreshOrders = async () => {
                const orders = await fetchKitchenOrders();
                set({ orders, loadError: null }, false, "kitchen/ordersRefreshed");
            };

            const applyResult = async (result: KitchenCommandResult) => {
                switch (result.event) {
                    case "list_orders":
                        set({ orders: result.orders }, false, "kitchen/ordersListed");
                        append(botText(summarizeOrders(result.orders)), "kitchen/botReply");
                        return;
                    case "update_status":
                        append({ sender: "bot", kind: "status", orderId: result.orderId, status: result.status }, "kitchen/statusCard");
                        await refreshOrders();
                        return;
                    case "error":
                        append(botText(result.message), "kitchen/botReply");
                }
            };

            return {
                orders: [],
                messages: [withId(botText(KITCHEN_GREETING))],
                isLoading: false,
                loadError: null,
                isSubmitting: false,

                loadOrders: async () => {
                    set({ isLoading: true, loadError: null }, false, "kitchen/loadStart");
                    try {
                        const orders = await fetchKitchenOrders();
                        set({ orders, isLoading: false }, false, "kitchen/loadSuccess");
                    } catch {
                        set({ isLoading: false, loadError: "Unable to load kitchen orders." }, false, "kitchen/loadError");
                    }
                },

                setStatus: async (orderId, status) => {
                    if (get().isSubmitting) return;
                    set({ isSubmitting: true }, false, "kitchen/submitStart");
                    try {
                        const result = await updateKitchenStatus(orderId, status);
                        await applyResult(
                            result.event === "error" ? { event: "error", message: `I could not update order #${orderId}.` } : result,
                        );
                    } catch {
                        append(botText("I could not reach the kitchen service."), "kitchen/botReply");
                    } finally {
                        set({ isSubmitting: false }, false, "kitchen/submitEnd");
                    }
                },

                sendMessage: async (text) => {
                    const trimmed = text.trim();
                    if (!trimmed || get().isSubmitting) return;
                    append({ sender: "user", kind: "text", text: trimmed }, "kitchen/userMessage");
                    set({ isSubmitting: true }, false, "kitchen/submitStart");
                    try {
                        await applyResult(await sendKitchenChat(trimmed));
                    } catch {
                        append(botText("I could not reach the kitchen service."), "kitchen/botReply");
                    } finally {
                        set({ isSubmitting: false }, false, "kitchen/submitEnd");
                    }
                },
            };
        },
        { name: "KitchenStore" },
    ),
);
