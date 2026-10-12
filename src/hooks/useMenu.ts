import { useCallback, useEffect, useState } from "react";
import { getMenu } from "../api/api";
import { useMenuStore } from "../store/menu.store";

export function useMenu() {
    const items = useMenuStore((state) => state.items);
    const setMenu = useMenuStore((state) => state.setMenu);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function fetchMenu() {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getMenu();

                if (cancelled == false) {
                    setMenu(result);
                }
            } catch {
                if (cancelled == false) {
                    setError("Unable to load menu.");
                }
            } finally {
                if (cancelled == false) {
                    setIsLoading(false);
                }
            }
        }

        void fetchMenu();

        return () => {
            cancelled = true;
        };
    }, [setMenu, reloadKey]);

    const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

    return {
        items,
        isLoading,
        error,
        refetch,
    };
}
