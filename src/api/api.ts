import { apiClient } from "../config/axios"

export interface RestaurantCurrency {
    code: string;
    symbol: string;
}

export async function getRestaurantCurrency(): Promise<RestaurantCurrency> {
    const response = await apiClient.get<RestaurantCurrency>(
        "/customer/currency",
    );
    return response.data;
}

export interface MenuAttributeValue {
    value: string;
    price_extra: number;
}

export interface MenuAttribute {
    name: string;
    display_type: string;
    values?: MenuAttributeValue[] | null;
    search_only: boolean;
    required: boolean;
}

export interface MenuItem {
    id: number;
    name: string;
    list_price: number;
    lst_price: number;
    image_url: string;
    categ_id: { id: number; display_name: string };
    currency_id: { id: number; display_name: string };
    activity_state: boolean;
    is_favorite: boolean;
    qty_available: number;
    product_template_id: number;
    product_variant_id: number;
    product_variant_count: number;
    attributes?: MenuAttribute[] | null;
}

interface MenuResponse {
    status: string;
    items: MenuItem[];
}

export async function getMenu(): Promise<MenuItem[]> {
    const response = await apiClient.get<MenuResponse>("/customer/menu");
    return response.data.items;
}
