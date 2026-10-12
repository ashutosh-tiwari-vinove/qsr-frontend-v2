import type { OpsMenuItem, OpsOrder, OpsUser } from '../components/ops/ops.types'

export const OPS_DEMO_CREDENTIALS = { username: 'ops_test', password: 'opstest123' } as const

export const OPS_DEMO_USER: OpsUser = { username: OPS_DEMO_CREDENTIALS.username }

export const OPS_GREETING = [
    'Hi! I can help you run the floor. Try:',
    '• "mark 12 as paid" or "mark 12, 13 as paid"',
    '• "cancel order 9"',
    '• "what\'s pending?"',
    '• "which tables are occupied?"',
    '• "details of order 12"',
    '• "show menu", or place an order such as "2 hot green teas"',
].join('\n')

export const MOCK_OPS_MENU: OpsMenuItem[] = [
    { id: 1, name: 'Hot Green Tea' },
    { id: 2, name: 'Masala Dosa' },
    { id: 3, name: 'Paneer Tikka' },
    { id: 4, name: 'Filter Coffee' },
    { id: 5, name: 'Veg Thali' },
]

/** Deterministic queue covering every bucket, source, stale flag and table shape. */
export const MOCK_OPS_ORDERS: OpsOrder[] = [
    {
        orderId: 9,
        tableName: 'T2',
        tableId: 2,
        kitchenStatus: 'preparing',
        source: 'CUSTOMER',
        billStatus: null,
        lines: [
            { id: 901, name: 'Paneer Tikka', qty: 2 },
            { id: 902, name: 'Butter Naan', qty: 4 },
        ],
    },
    {
        orderId: 10,
        tableId: 5,
        tableName: null,
        kitchenStatus: 'to_prepare',
        source: 'CUSTOMER',
        billStatus: null,
        stale: true,
        lines: [{ id: 1001, name: 'Mango Lassi with Saffron and Cardamom (Large, Chilled)', qty: 3 }],
    },
    {
        orderId: 11,
        tableName: 'Patio 1',
        kitchenStatus: 'ready',
        source: 'OPS',
        billStatus: null,
        lines: [{ id: 1101, name: 'Veg Thali', qty: 1 }],
    },
    {
        orderId: 12,
        tableName: 'T4',
        tableId: 4,
        kitchenStatus: 'done',
        source: 'CUSTOMER',
        billStatus: 'REQUESTED',
        lines: [
            { id: 1201, name: 'Masala Dosa', qty: 2 },
            { id: 1202, name: 'Filter Coffee', qty: 2 },
        ],
    },
    {
        orderId: 13,
        tableName: 'T7',
        tableId: 7,
        kitchenStatus: 'done',
        source: 'OPS',
        billStatus: 'UNDER_REVIEW',
        lines: [{ id: 1301, name: 'Dal Makhani', qty: 1 }],
    },
    {
        orderId: 8,
        tableName: 'T1',
        tableId: 1,
        kitchenStatus: 'done',
        source: 'CUSTOMER',
        billStatus: 'PAID',
        lines: [{ id: 801, name: 'Chicken Biryani', qty: 2 }],
    },
]
