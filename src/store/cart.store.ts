import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type CartSelections = Record<string, string[]>;

export interface CartLine {
    lineId: string;
    itemId: number;
    name: string;
    imageUrl: string;
    /** Price of one unit including any paid options. */
    unitPrice: number;
    quantity: number;
    selections: CartSelections;
    note: string;
}

interface CartState {
    lines: CartLine[];
    /** Adds a line, or increases the quantity of an identical one (same dish, options and note). */
    addLine: (line: Omit<CartLine, "lineId">) => void;
    removeLine: (lineId: string) => void;
    /** Sets a line's quantity (minimum 1; use removeLine to delete it). */
    setQuantity: (lineId: string, quantity: number) => void;
    /** Sets a line's note. Merges into an identical line if the edit makes two lines the same. */
    setNote: (lineId: string, note: string) => void;
    clearCart: () => void;
}

function configurationKey(line: Pick<CartLine, "itemId" | "selections" | "note">): string {
    const selections = Object.keys(line.selections)
        .sort()
        .map((name) => [name, [...line.selections[name]].sort()]);
    return JSON.stringify([line.itemId, selections, line.note.trim()]);
}

let nextLineId = 0;

export const useCartStore = create<CartState>()(
    devtools(
        (set) => ({
            lines: [],

            addLine: (line) =>
                set(
                    (state) => {
                        const key = configurationKey(line);
                        const existing = state.lines.find((entry) => configurationKey(entry) === key);

                        if (existing) {
                            return {
                                lines: state.lines.map((entry) =>
                                    entry.lineId === existing.lineId
                                        ? { ...entry, quantity: entry.quantity + line.quantity }
                                        : entry,
                                ),
                            };
                        }

                        return { lines: [...state.lines, { ...line, lineId: `line-${nextLineId++}` }] };
                    },
                    false,
                    "cart/addLine",
                ),

            removeLine: (lineId) =>
                set(
                    (state) => ({ lines: state.lines.filter((line) => line.lineId !== lineId) }),
                    false,
                    "cart/removeLine",
                ),

            setQuantity: (lineId, quantity) =>
                set(
                    (state) => ({
                        lines: state.lines.map((line) =>
                            line.lineId === lineId ? { ...line, quantity: Math.max(1, quantity) } : line,
                        ),
                    }),
                    false,
                    "cart/setQuantity",
                ),

            setNote: (lineId, note) =>
                set(
                    (state) => {
                        const target = state.lines.find((line) => line.lineId === lineId);
                        if (!target) return state;

                        const updated = { ...target, note: note.trim() };
                        const duplicate = state.lines.find(
                            (line) =>
                                line.lineId !== lineId && configurationKey(line) === configurationKey(updated),
                        );

                        if (duplicate) {
                            return {
                                lines: state.lines
                                    .filter((line) => line.lineId !== lineId)
                                    .map((line) =>
                                        line.lineId === duplicate.lineId
                                            ? { ...line, quantity: line.quantity + target.quantity }
                                            : line,
                                    ),
                            };
                        }

                        return { lines: state.lines.map((line) => (line.lineId === lineId ? updated : line)) };
                    },
                    false,
                    "cart/setNote",
                ),

            clearCart: () => set({ lines: [] }, false, "cart/clearCart"),
        }),
        {
            name: "CartStore",
        }
    )
);

export const selectCartCount = (state: CartState) =>
    state.lines.reduce((total, line) => total + line.quantity, 0);

export const selectCartTotal = (state: CartState) =>
    state.lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
