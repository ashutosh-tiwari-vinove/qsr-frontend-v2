import type { KitchenStatus } from '../kitchen/kitchen.types'

export type OpsOrderSource = 'CUSTOMER' | 'OPS'

export type BillStatus = 'REQUESTED' | 'UNDER_REVIEW' | 'PAID'

export interface OpsOrderLine {
    id: number
    name: string
    qty: number
}

export interface OpsOrder {
    orderId: number
    tableId?: number | null
    tableName?: string | null
    kitchenStatus: KitchenStatus
    source: OpsOrderSource
    /** `null` until the customer asks for the bill. */
    billStatus: BillStatus | null
    /** The kitchen has taken longer than usual. */
    stale?: boolean
    lines: OpsOrderLine[]
}

export interface OpsQueue {
    active: OpsOrder[]
    waiting: OpsOrder[]
    completed: OpsOrder[]
}

export interface OpsUser {
    username: string
}

export interface OpsMenuItem {
    id: number
    name: string
}

export type OpsChatMessage =
    | { id: number; sender: 'bot' | 'user'; kind: 'text'; text: string }
    | { id: number; sender: 'bot'; kind: 'detail'; order: OpsOrder }

/** Reply to an Ops chat command; `queueChanged` tells the UI to refresh the queue. */
export interface OpsChatReply {
    message: string
    orders?: OpsOrder[]
    queueChanged: boolean
}
