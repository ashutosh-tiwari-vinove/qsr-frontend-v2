import { useEffect, useState } from "react";
import { getRestaurantCurrency } from "../api/api";
import { useCurrencyStore } from "../store/currency.store";

export function useCurrency() {
    const currency = useCurrencyStore((state) => state.currency);
    const setCurrency = useCurrencyStore((state) => state.setCurrency);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchCurrency() {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getRestaurantCurrency();

                if (cancelled == false) {
                    setCurrency(result);
                }
            } catch {
                if (cancelled == false) {
                    setError("Unable to load restaurant currency.");
                }
            } finally {
                if (cancelled == false) {
                    setIsLoading(false);
                }
            }
        }

        void fetchCurrency();

        return () => {
            cancelled = true;
        };
    }, [setCurrency]);

    return {
        currency,
        isLoading,
        error,
    };
}