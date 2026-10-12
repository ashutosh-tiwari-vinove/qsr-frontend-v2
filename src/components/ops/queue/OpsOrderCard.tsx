import { KITCHEN_STATUS_BADGE_CLASSES, KITCHEN_STATUS_LABELS, getTableLabel } from '../../kitchen/kitchen.utils'
import type { OpsOrder } from '../ops.types'
import { canCancel, isBillPending } from '../ops.utils'

type OpsOrderCardProps = {
    order: OpsOrder
    disabled: boolean
    /** Completed orders are read-only and show a "Paid" badge. */
    completed?: boolean
    onApproveBill?: (orderId: number) => void
    onCancel?: (orderId: number) => void
}

const ACTION_CLASSES =
    'min-h-[32px] cursor-pointer rounded-full px-3.5 text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e] disabled:pointer-events-none disabled:opacity-50 lg:min-h-[36px] lg:text-[13px]'

export default function OpsOrderCard({ order, disabled, completed = false, onApproveBill, onCancel }: OpsOrderCardProps) {
    const showApprove = isBillPending(order) && onApproveBill
    const showCancel = canCancel(order) && onCancel

    return (
        <li className="flex flex-col gap-3 rounded-2xl border border-[#263831] bg-[#151c1b] p-4">
            <div className="flex items-start justify-between gap-3">
                <h3 className="m-0 min-w-0 break-words font-serif text-[16px] text-[#f3efe8] lg:text-[18px]">
                    #{order.orderId} - Table {getTableLabel(order)}
                </h3>
                <span
                    className={`flex-none rounded-full border px-2.5 py-0.5 text-[11px] lg:text-[12px] ${
                        completed ? KITCHEN_STATUS_BADGE_CLASSES.done : KITCHEN_STATUS_BADGE_CLASSES[order.kitchenStatus]
                    }`}
                >
                    {completed ? 'Paid' : KITCHEN_STATUS_LABELS[order.kitchenStatus]}
                </span>
            </div>

            {(order.source === 'OPS' || order.stale || isBillPending(order)) && (
                <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[12px] text-[#c7d1cc] lg:text-[13px]">
                    {order.source === 'OPS' && <li>Placed by Ops</li>}
                    {order.stale && <li className="text-[#f0c658]">⚠ Waiting on the kitchen longer than usual</li>}
                    {isBillPending(order) && <li className="text-[#f3dfb5]">💵 Bill requested - awaiting approval</li>}
                </ul>
            )}

            <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[13px] text-[#e9e7e1] lg:text-[14px]">
                {order.lines.map((line) => (
                    <li key={line.id} className="break-words">
                        {line.qty}× {line.name}
                    </li>
                ))}
            </ul>

            {(showApprove || showCancel) && (
                <div className="flex flex-wrap gap-2">
                    {showApprove && (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => onApproveBill(order.orderId)}
                            className={`${ACTION_CLASSES} bg-[#f16b4e] text-[#1b211e] hover:bg-[#ff8062]`}
                        >
                            Mark as paid
                        </button>
                    )}
                    {showCancel && (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => onCancel(order.orderId)}
                            className={`${ACTION_CLASSES} border border-[#2a3a34] bg-[#161f1c] text-[#c7d1cc] hover:border-[#f16b4e]/60 hover:text-[#f3efe8]`}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </li>
    )
}
