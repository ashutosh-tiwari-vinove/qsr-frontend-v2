export const KITCHEN_STATUS_SEQUENCE = ['to_prepare', 'preparing', 'ready', 'done'] as const

export type KitchenStatus = (typeof KITCHEN_STATUS_SEQUENCE)[number]

export interface OrderLine {
    id: number
    name: string
    qty: number
    kitchenStatus: KitchenStatus
}

export interface KitchenOrder {
    orderId: number
    trackingNumber?: string
    posReference?: string
    tableId?: number | null
    tableName?: string | null
    kitchenStatus: KitchenStatus
    customerNote?: string
    lines: OrderLine[]
}

export type KitchenChatMessage =
    | { id: number; sender: 'bot' | 'user'; kind: 'text'; text: string }
    | { id: number; sender: 'bot'; kind: 'status'; orderId: number; status: KitchenStatus }

/** Outcome of a status update or chat command, shaped so a real API response can map onto it. */
export type KitchenCommandResult =
    | { event: 'list_orders'; orders: KitchenOrder[] }
    | { event: 'update_status'; orderId: number; status: KitchenStatus }
    | { event: 'error'; message: string }
