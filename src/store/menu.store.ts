import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { MenuItem } from "../api/api";

interface MenuState {
    items: MenuItem[];
    setMenu: (items: MenuItem[]) => void;
    clearMenu: () => void;
}

export const useMenuStore = create<MenuState>()(
    devtools(
        (set) => ({
            items: [],

            setMenu: (items) => set({ items }, false, "menu/setMenu"),

            clearMenu: () => set({ items: [] }, false, "menu/clearMenu"),
        }),
        {
            name: "MenuStore",
        }
    )
);
