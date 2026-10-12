import Pill from '../../ui/button/Pill'
import { KITCHEN_STATUS_SEQUENCE } from '../kitchen.types'
import type { KitchenOrder, KitchenStatus } from '../kitchen.types'
import {
    KITCHEN_STATUS_BADGE_CLASSES,
    KITCHEN_STATUS_DOT_CLASSES,
    KITCHEN_STATUS_LABELS,
    getOrderLabel,
    getTableLabel,
} from '../kitchen.utils'

type OrderCardProps = {
    order: KitchenOrder
    disabled: boolean
    onStatusChange: (orderId: number, status: KitchenStatus) => void
}

export default function OrderCard({ order, disabled, onStatusChange }: OrderCardProps) {
    return (
        <li className="flex flex-col gap-3 rounded-2xl border border-[#263831] bg-[#151c1b] p-4 lg:p-5">
            <div className="flex items-start justify-between gap-3">
                <h3 className="m-0 min-w-0 break-words font-serif text-[16px] text-[#f3efe8] lg:text-[18px]">
                    #{getOrderLabel(order)} · Table {getTableLabel(order)}
                </h3>
                <span className={`flex-none rounded-full border px-2.5 py-0.5 text-[11px] lg:text-[12px] ${KITCHEN_STATUS_BADGE_CLASSES[order.kitchenStatus]}`}>
                    {KITCHEN_STATUS_LABELS[order.kitchenStatus]}
                </span>
            </div>

            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                {order.lines.map((line) => (
                    <li key={line.id} className="flex items-start gap-2 text-[13px] text-[#e9e7e1] lg:text-[14px]">
                        <span
                            aria-label={KITCHEN_STATUS_LABELS[line.kitchenStatus]}
                            role="img"
                            className={`mt-1.5 size-2 flex-none rounded-full ${KITCHEN_STATUS_DOT_CLASSES[line.kitchenStatus]}`}
                        />
                        <span className="min-w-0 break-words">
                            {line.qty}× {line.name}
                        </span>
                    </li>
                ))}
            </ul>

            {order.customerNote && (
                <p className="m-0 rounded-md border-l-2 border-[#f16b4e] bg-[#1d2a25] px-3 py-2 text-[12px] break-words text-[#c7d1cc] lg:text-[13px]">
                    Customer note: {order.customerNote}
                </p>
            )}

            <div role="group" aria-label={`Update status for order ${getOrderLabel(order)}`} className="flex flex-wrap gap-2">
                {KITCHEN_STATUS_SEQUENCE.map((status) => (
                    <Pill
                        key={status}
                        variant="status"
                        label={KITCHEN_STATUS_LABELS[status]}
                        selected={order.kitchenStatus === status}
                        disabled={disabled}
                        onClick={() => onStatusChange(order.orderId, status)}
                    />
                ))}
            </div>
        </li>
    )
}
