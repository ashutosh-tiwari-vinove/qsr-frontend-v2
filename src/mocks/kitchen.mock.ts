import type { KitchenOrder } from '../components/kitchen/kitchen.types'

export const KITCHEN_GREETING =
    'Hi! I\'m the kitchen assistant. Ask me things like "what\'s pending" or "order 12 is ready".'

/** Deterministic sample queue covering every status, label source, table shape and note/no-note case. */
export const MOCK_KITCHEN_ORDERS: KitchenOrder[] = [
    {
        orderId: 12,
        trackingNumber: 'A-012',
        tableName: 'T4',
        tableId: 4,
        kitchenStatus: 'to_prepare',
        customerNote: 'No onions please, and extra spicy on the paneer tikka.',
        lines: [
            { id: 1201, name: 'Paneer Tikka', qty: 2, kitchenStatus: 'to_prepare' },
            { id: 1202, name: 'Butter Naan', qty: 4, kitchenStatus: 'to_prepare' },
        ],
    },
    {
        orderId: 13,
        posReference: 'POS-0013',
        tableId: 7,
        tableName: null,
        kitchenStatus: 'preparing',
        lines: [
            { id: 1301, name: 'Chicken Biryani', qty: 1, kitchenStatus: 'preparing' },
            { id: 1302, name: 'Raita', qty: 1, kitchenStatus: 'ready' },
            { id: 1303, name: 'Mango Lassi with Saffron and Cardamom (Large, Chilled)', qty: 2, kitchenStatus: 'to_prepare' },
        ],
    },
    {
        orderId: 14,
        tableName: 'Patio 2',
        kitchenStatus: 'ready',
        customerNote: 'Allergic to peanuts.',
        lines: [{ id: 1401, name: 'Veg Thali', qty: 1, kitchenStatus: 'ready' }],
    },
    {
        orderId: 15,
        trackingNumber: 'A-015',
        tableId: null,
        kitchenStatus: 'to_prepare',
        lines: [
            { id: 1501, name: 'Masala Dosa', qty: 2, kitchenStatus: 'to_prepare' },
            { id: 1502, name: 'Filter Coffee', qty: 2, kitchenStatus: 'to_prepare' },
            { id: 1503, name: 'Medu Vada', qty: 3, kitchenStatus: 'to_prepare' },
            { id: 1504, name: 'Idli Sambar', qty: 1, kitchenStatus: 'to_prepare' },
            { id: 1505, name: 'Gulab Jamun', qty: 2, kitchenStatus: 'to_prepare' },
        ],
    },
    {
        orderId: 16,
        trackingNumber: 'A-016',
        tableName: 'T1',
        tableId: 1,
        kitchenStatus: 'done',
        lines: [{ id: 1601, name: 'Dal Makhani', qty: 1, kitchenStatus: 'done' }],
    },
]
