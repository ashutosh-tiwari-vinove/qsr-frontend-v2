import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RestaurantCurrency } from "../api/api";

interface CurrencyState {
    currency: RestaurantCurrency | null;
    setCurrency: (currency: RestaurantCurrency) => void;
    clearCurrency: () => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    devtools(
        (set) => ({
            currency: null,

            setCurrency: (currency) => set({ currency }, false, "currency/setCurrency"),

            clearCurrency: () => set({ currency: null }, false, "currency/clearCurrency"),
        }),
        {
            name: "CurrencyStore",
        }
    )
);