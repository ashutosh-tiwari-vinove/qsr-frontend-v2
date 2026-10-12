import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { approveBill, cancelOrder, fetchOpsOrders, login, logout, restoreSession, sendOpsChat } from "../api/ops.api";
import type { OpsChatMessage, OpsOrder, OpsUser } from "../components/ops/ops.types";
import { OPS_GREETING } from "../mocks/ops.mock";

type NewMessage = OpsChatMessage extends infer M ? (M extends unknown ? Omit<M, "id"> : never) : never;

interface OpsState {
    user: OpsUser | null;
    isCheckingAuth: boolean;
    orders: OpsOrder[];
    isLoading: boolean;
    loadError: string | null;
    /** True while a queue action (mark paid / cancel) is in flight. */
    busy: boolean;
    messages: OpsChatMessage[];
    isSubmitting: boolean;
    checkSession: () => Promise<void>;
    /** Resolves to an error message, or null on success. */
    login: (username: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
    loadQueue: () => Promise<void>;
    approveBill: (orderId: number) => Promise<void>;
    cancelOrder: (orderId: number) => Promise<void>;
    sendMessage: (text: string) => Promise<void>;
}

let nextMessageId = 1;
const withId = (message: NewMessage): OpsChatMessage => ({ ...message, id: nextMessageId++ });
const botText = (text: string): NewMessage => ({ sender: "bot", kind: "text", text });
const initialMessages = () => [withId(botText(OPS_GREETING))];

export const useOpsStore = create<OpsState>()(
    devtools(
        (set, get) => {
            const append = (message: NewMessage, label: string) =>
                set((state) => ({ messages: [...state.messages, withId(message)] }), false, label);

            const refreshOrders = async () => {
                const orders = await fetchOpsOrders();
                set({ orders, loadError: null }, false, "ops/ordersRefreshed");
            };

            /** Runs a queue action, then refreshes; failures surface in the queue's error state. */
            const runQueueAction = async (action: () => Promise<void>) => {
                if (get().busy) return;
                set({ busy: true }, false, "ops/busyStart");
                try {
                    await action();
                    await refreshOrders();
                } catch {
                    set({ loadError: "That action failed. Please try again." }, false, "ops/actionError");
                } finally {
                    set({ busy: false }, false, "ops/busyEnd");
                }
            };

            return {
                user: null,
                isCheckingAuth: true,
                orders: [],
                isLoading: false,
                loadError: null,
                busy: false,
                messages: initialMessages(),
                isSubmitting: false,

                checkSession: async () => {
                    const user = await restoreSession();
                    set({ user, isCheckingAuth: false }, false, "ops/sessionChecked");
                },

                login: async (username, password) => {
                    try {
                        const user = await login(username, password);
                        if (!user) return "Invalid username or password.";
                        set({ user }, false, "ops/loggedIn");
                        return null;
                    } catch {
                        return "Could not reach the server.";
                    }
                },

                logout: async () => {
                    await logout();
                    set({ user: null, orders: [], messages: initialMessages(), loadError: null }, false, "ops/loggedOut");
                },

                loadQueue: async () => {
                    set({ isLoading: true, loadError: null }, false, "ops/loadStart");
                    try {
                        const orders = await fetchOpsOrders();
                        set({ orders, isLoading: false }, false, "ops/loadSuccess");
                    } catch {
                        set({ isLoading: false, loadError: "Unable to load the operations queue." }, false, "ops/loadError");
                    }
                },

                approveBill: (orderId) => runQueueAction(() => approveBill(orderId)),
                cancelOrder: (orderId) => runQueueAction(() => cancelOrder(orderId)),

                sendMessage: async (text) => {
                    const trimmed = text.trim();
                    if (!trimmed || get().isSubmitting) return;
                    append({ sender: "user", kind: "text", text: trimmed }, "ops/userMessage");
                    set({ isSubmitting: true }, false, "ops/submitStart");
                    try {
                        const reply = await sendOpsChat(trimmed);
                        if (reply.orders) {
                            for (const order of reply.orders) append({ sender: "bot", kind: "detail", order }, "ops/orderDetail");
                        } else {
                            append(botText(reply.message), "ops/botReply");
                        }
                        if (reply.queueChanged) await refreshOrders();
                    } catch {
                        append(botText("I could not reach the Ops service."), "ops/botReply");
                    } finally {
                        set({ isSubmitting: false }, false, "ops/submitEnd");
                    }
                },
            };
        },
        { name: "OpsStore" },
    ),
);
