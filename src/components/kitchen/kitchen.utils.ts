import { KITCHEN_STATUS_SEQUENCE } from './kitchen.types'
import type { KitchenOrder, KitchenStatus } from './kitchen.types'

export const KITCHEN_STATUS_LABELS: Record<KitchenStatus, string> = {
    to_prepare: 'To Prepare',
    preparing: 'Preparing',
    ready: 'Ready',
    done: 'Done',
}

export const KITCHEN_STATUS_BADGE_CLASSES: Record<KitchenStatus, string> = {
    to_prepare: 'border-[#b0a89c]/40 bg-[#b0a89c]/10 text-[#d6d0c6]',
    preparing: 'border-[#d8a41f]/50 bg-[#d8a41f]/10 text-[#f0c658]',
    ready: 'border-[#39d49b]/50 bg-[#39d49b]/10 text-[#6fe0b4]',
    done: 'border-[#4a4640] bg-[#4a4640]/30 text-[#9a948a]',
}

export const KITCHEN_STATUS_DOT_CLASSES: Record<KitchenStatus, string> = {
    to_prepare: 'bg-[#b0a89c]',
    preparing: 'bg-[#d8a41f]',
    ready: 'bg-[#39d49b]',
    done: 'bg-[#4a4640]',
}

/** Kitchen-facing sentence shown on the status card after an update. */
export const KITCHEN_STATUS_COPY: Record<KitchenStatus, string> = {
    to_prepare: 'is waiting to be prepared.',
    preparing: 'is now being prepared.',
    ready: 'is ready for pickup.',
    done: 'has been completed.',
}

export function normalizeKitchenStatus(value?: string): KitchenStatus | undefined {
    const normalized = value?.trim().toLowerCase().replace(/\s+/g, '_')
    return KITCHEN_STATUS_SEQUENCE.find((status) => status === normalized)
}

export function getOrderLabel(order: KitchenOrder): string {
    return order.trackingNumber || order.posReference || String(order.orderId)
}

export function getTableLabel(order: Pick<KitchenOrder, 'tableId' | 'tableName'>): string {
    return order.tableName ?? (order.tableId != null ? String(order.tableId) : '-')
}

const STATUS_WORDS: Record<string, KitchenStatus> = {
    ready: 'ready',
    done: 'done',
    completed: 'done',
    complete: 'done',
    preparing: 'preparing',
    'being prepared': 'preparing',
    'to prepare': 'to_prepare',
    pending: 'to_prepare',
    waiting: 'to_prepare',
}

export type ParsedKitchenCommand =
    | { type: 'list' }
    | { type: 'update'; orderId: number; status: KitchenStatus }
    | { type: 'unknown' }

/** Local stand-in for the backend's kitchen intent agent: handles "what's pending" and "order 12 is ready". */
export function parseKitchenCommand(text: string): ParsedKitchenCommand {
    const input = text.trim().toLowerCase()

    if (/\b(what'?s|what is|show|list)\b.*\b(pending|queue|orders?|active)\b/.test(input)) {
        return { type: 'list' }
    }

    const match = input.match(/order\s*#?\s*(\d+)\s*(?:is|as|to|->)?\s*(?:now\s+)?(.+)$/)
    if (match) {
        const phrase = match[2].replace(/[.!]+$/, '').trim()
        const status = normalizeKitchenStatus(phrase) ?? STATUS_WORDS[phrase]
        if (status) return { type: 'update', orderId: Number(match[1]), status }
    }

    return { type: 'unknown' }
}

export function summarizeOrders(orders: KitchenOrder[]): string {
    if (orders.length === 0) return 'There are no active orders right now.'
    return orders
        .map((order) => `#${getOrderLabel(order)} (Table ${getTableLabel(order)}) — ${KITCHEN_STATUS_LABELS[order.kitchenStatus]}`)
        .join('\n')
}
