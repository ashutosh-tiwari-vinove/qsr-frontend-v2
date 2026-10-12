import type { OpsChatReply, OpsOrder, OpsUser } from '../components/ops/ops.types'
import { describeOrder, isBillPending, parseOpsCommand, canCancel } from '../components/ops/ops.utils'
import { getTableLabel } from '../components/kitchen/kitchen.utils'
import { MOCK_OPS_MENU, MOCK_OPS_ORDERS, OPS_DEMO_CREDENTIALS } from '../mocks/ops.mock'

/**
 * Mock Ops service. Signatures mirror what a real API client would expose, so swapping in HTTP
 * calls later only touches this file.
 */

const LATENCY_MS = 350
const SESSION_KEY = 'ops-session'

let orders: OpsOrder[] = structuredClone(MOCK_OPS_ORDERS)
let nextOrderId = Math.max(...orders.map((order) => order.orderId)) + 1

type PendingOrder = { itemName: string; qty: number; customerName?: string }
let pendingOrder: PendingOrder | null = null

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS))
const snapshot = () => structuredClone(orders)

function readSession(): string | null {
    try {
        return sessionStorage.getItem(SESSION_KEY)
    } catch {
        return null
    }
}

function writeSession(username: string | null) {
    try {
        if (username) sessionStorage.setItem(SESSION_KEY, username)
        else sessionStorage.removeItem(SESSION_KEY)
    } catch {
        // Storage can be unavailable (private mode); the session then lasts for this page load only.
    }
}

export async function restoreSession(): Promise<OpsUser | null> {
    await delay()
    const username = readSession()
    return username ? { username } : null
}

export async function login(username: string, password: string): Promise<OpsUser | null> {
    await delay()
    if (username.trim() !== OPS_DEMO_CREDENTIALS.username || password !== OPS_DEMO_CREDENTIALS.password) return null
    writeSession(username.trim())
    return { username: username.trim() }
}

export async function logout(): Promise<void> {
    writeSession(null)
    pendingOrder = null
}

export async function fetchOpsOrders(): Promise<OpsOrder[]> {
    await delay()
    return snapshot()
}

export async function approveBill(orderId: number): Promise<void> {
    await delay()
    orders = orders.map((order) => (order.orderId === orderId && isBillPending(order) ? { ...order, billStatus: 'PAID' } : order))
}

export async function cancelOrder(orderId: number): Promise<void> {
    await delay()
    orders = orders.filter((order) => order.orderId !== orderId || !canCancel(order))
}

function markPaid(orderIds: number[]): OpsChatReply {
    const lines = orderIds.map((id) => {
        const order = orders.find((entry) => entry.orderId === id)
        if (!order) return `Order #${id} was not found.`
        if (order.billStatus === 'PAID') return `Order #${id} is already paid.`
        if (!isBillPending(order)) return `Order #${id} has not requested a bill yet.`
        orders = orders.map((entry) => (entry.orderId === id ? { ...entry, billStatus: 'PAID' } : entry))
        return `Order #${id} marked as paid.`
    })
    return { message: lines.join('\n'), queueChanged: true }
}

function cancel(orderId: number): OpsChatReply {
    const order = orders.find((entry) => entry.orderId === orderId)
    if (!order) return { message: `Order #${orderId} was not found.`, queueChanged: false }
    if (!canCancel(order)) return { message: `Order #${orderId} is already paid and cannot be cancelled.`, queueChanged: false }
    orders = orders.filter((entry) => entry.orderId !== orderId)
    return { message: `Order #${orderId} cancelled.`, queueChanged: true }
}

function pendingSummary(): OpsChatReply {
    const open = orders.filter((order) => order.billStatus !== 'PAID')
    if (open.length === 0) return { message: 'There are no pending orders right now.', queueChanged: false }
    return { message: open.map(describeOrder).join('\n'), queueChanged: false }
}

function occupiedTables(): OpsChatReply {
    const tables = [...new Set(orders.filter((order) => order.billStatus !== 'PAID').map(getTableLabel))]
    return {
        message: tables.length ? `Occupied tables: ${tables.join(', ')}` : 'No tables are occupied right now.',
        queueChanged: false,
    }
}

function continueOrder(pending: PendingOrder, answer: string): OpsChatReply {
    if (!pending.customerName) {
        pendingOrder = { ...pending, customerName: answer }
        return { message: `Thanks ${answer}. Which table is this for?`, queueChanged: false }
    }

    const tableNumber = Number(answer.match(/\d+/)?.[0])
    if (!tableNumber) return { message: 'Please give me a table number, e.g. "4".', queueChanged: false }

    const orderId = nextOrderId++
    orders = [
        ...orders,
        {
            orderId,
            tableId: tableNumber,
            tableName: `T${tableNumber}`,
            kitchenStatus: 'to_prepare',
            source: 'OPS',
            billStatus: null,
            lines: [{ id: orderId * 100 + 1, name: pending.itemName, qty: pending.qty }],
        },
    ]
    pendingOrder = null
    return { message: `Order confirmed · #${orderId} is now being prepared.`, queueChanged: true }
}

export async function sendOpsChat(text: string): Promise<OpsChatReply> {
    await delay()
    const command = parseOpsCommand(text, MOCK_OPS_MENU)

    if (command.type === 'abort' && pendingOrder) {
        pendingOrder = null
        return { message: 'Okay, I dropped that order.', queueChanged: false }
    }
    if (pendingOrder && command.type === 'unknown') return continueOrder(pendingOrder, text.trim())

    switch (command.type) {
        case 'markPaid':
            return markPaid(command.orderIds)
        case 'cancel':
            return cancel(command.orderId)
        case 'pending':
            return pendingSummary()
        case 'tables':
            return occupiedTables()
        case 'detail': {
            const order = orders.find((entry) => entry.orderId === command.orderId)
            return order
                ? { message: `Order #${order.orderId}`, orders: [structuredClone(order)], queueChanged: false }
                : { message: `Order #${command.orderId} was not found.`, queueChanged: false }
        }
        case 'menu':
            return { message: MOCK_OPS_MENU.map((item) => `• ${item.name}`).join('\n'), queueChanged: false }
        case 'order':
            pendingOrder = { itemName: command.item.name, qty: command.qty }
            return { message: `Got it: ${command.qty}× ${command.item.name}. What is the customer's name?`, queueChanged: false }
        default:
            return { message: 'I could not process that request.', queueChanged: false }
    }
}
