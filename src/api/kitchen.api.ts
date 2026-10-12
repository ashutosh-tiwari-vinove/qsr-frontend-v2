import type { KitchenCommandResult, KitchenOrder, KitchenStatus } from '../components/kitchen/kitchen.types'
import { parseKitchenCommand } from '../components/kitchen/kitchen.utils'
import { MOCK_KITCHEN_ORDERS } from '../mocks/kitchen.mock'

/**
 * Mock kitchen service. Signatures mirror what a real API client would expose, so swapping in
 * HTTP calls later only touches this file.
 */

const LATENCY_MS = 350

let orders: KitchenOrder[] = structuredClone(MOCK_KITCHEN_ORDERS)

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS))

const snapshot = () => structuredClone(orders)

export async function fetchKitchenOrders(): Promise<KitchenOrder[]> {
    await delay()
    return snapshot()
}

export async function updateKitchenStatus(orderId: number, status: KitchenStatus): Promise<KitchenCommandResult> {
    await delay()
    if (!orders.some((order) => order.orderId === orderId)) {
        return { event: 'error', message: `I could not find order #${orderId}.` }
    }
    orders = orders.map((order) =>
        order.orderId === orderId
            ? {
                  ...order,
                  kitchenStatus: status,
                  lines: order.lines.map((line) => ({ ...line, kitchenStatus: status })),
              }
            : order,
    )
    return { event: 'update_status', orderId, status }
}

export async function sendKitchenChat(text: string): Promise<KitchenCommandResult> {
    const command = parseKitchenCommand(text)
    if (command.type === 'list') {
        await delay()
        return { event: 'list_orders', orders: snapshot() }
    }
    if (command.type === 'update') return updateKitchenStatus(command.orderId, command.status)
    await delay()
    return { event: 'error', message: 'I could not process that request.' }
}
