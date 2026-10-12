import { getTableLabel } from '../kitchen/kitchen.utils'
import type { OpsMenuItem, OpsOrder, OpsQueue } from './ops.types'

export const isBillPending = (order: OpsOrder) => order.billStatus === 'REQUESTED' || order.billStatus === 'UNDER_REVIEW'

export const canCancel = (order: OpsOrder) => order.billStatus !== 'PAID'

/** Splits orders into the three queue buckets, keeping input order. */
export function bucketOrders(orders: OpsOrder[]): OpsQueue {
    return {
        completed: orders.filter((order) => order.billStatus === 'PAID'),
        waiting: orders.filter(isBillPending),
        active: orders.filter((order) => order.billStatus === null),
    }
}

export const summarizeQueue = ({ active, waiting, completed }: OpsQueue) =>
    `${active.length} active · ${waiting.length} waiting · ${completed.length} completed`

export function describeOrder(order: OpsOrder): string {
    return `#${order.orderId} (Table ${getTableLabel(order)}) — ${order.lines.map((line) => `${line.qty}× ${line.name}`).join(', ')}`
}

export type ParsedOpsCommand =
    | { type: 'markPaid'; orderIds: number[] }
    | { type: 'cancel'; orderId: number }
    | { type: 'pending' }
    | { type: 'tables' }
    | { type: 'detail'; orderId: number }
    | { type: 'menu' }
    | { type: 'order'; item: OpsMenuItem; qty: number }
    | { type: 'abort' }
    | { type: 'unknown' }

const extractIds = (text: string) => (text.match(/\d+/g) ?? []).map(Number)

/** Local stand-in for the backend Ops agent. Order placement is matched against the given menu. */
export function parseOpsCommand(text: string, menu: OpsMenuItem[]): ParsedOpsCommand {
    const input = text.trim().toLowerCase()

    if (/^(cancel|stop|never ?mind)[.!]*$/.test(input)) return { type: 'abort' }

    const paid = input.match(/mark\s+(.+?)\s+(?:as\s+)?paid/)
    if (paid) {
        const orderIds = extractIds(paid[1])
        if (orderIds.length > 0) return { type: 'markPaid', orderIds }
    }

    const cancel = input.match(/cancel\s+(?:order\s+)?#?(\d+)/)
    if (cancel) return { type: 'cancel', orderId: Number(cancel[1]) }

    if (/\b(pending|queue|active|waiting)\b/.test(input)) return { type: 'pending' }
    if (/\btables?\b.*\b(occupied|busy|taken)\b|\boccupied\b/.test(input)) return { type: 'tables' }

    const detail = input.match(/(?:details?|status|show)\s+(?:of\s+)?(?:order\s+)?#?(\d+)|order\s+#?(\d+)\s+details?/)
    if (detail) return { type: 'detail', orderId: Number(detail[1] ?? detail[2]) }

    if (/\bmenu\b/.test(input)) return { type: 'menu' }

    const item = menu.find((entry) => input.includes(entry.name.toLowerCase().replace(/s$/, '')))
    if (item) {
        const qty = Number(input.match(/\b(\d+)\b/)?.[1] ?? 1)
        return { type: 'order', item, qty: Math.max(1, qty) }
    }

    return { type: 'unknown' }
}
