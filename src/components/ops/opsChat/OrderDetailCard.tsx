import { KITCHEN_STATUS_BADGE_CLASSES, KITCHEN_STATUS_LABELS, getTableLabel } from '../../kitchen/kitchen.utils'
import type { OpsOrder } from '../ops.types'

type OrderDetailCardProps = {
    order: OpsOrder
}

export default function OrderDetailCard({ order }: OrderDetailCardProps) {
    const rows: [string, string][] = [
        ['Table', getTableLabel(order)],
        ['Placed by', order.source === 'OPS' ? 'Ops' : 'Customer'],
        ['Bill', order.billStatus ? order.billStatus.replace('_', ' ').toLowerCase() : 'not requested'],
    ]

    return (
        <div className="flex w-full max-w-[min(42rem,100%)] animate-[bubble-in_220ms_ease-out] flex-col gap-3 rounded-2xl border border-[#263831] bg-[#151c1b] p-4 lg:p-5">
            <div className="flex items-center justify-between gap-3">
                <p className="m-0 font-serif text-[16px] text-[#f3efe8] lg:text-[18px]">Order #{order.orderId}</p>
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] lg:text-[12px] ${KITCHEN_STATUS_BADGE_CLASSES[order.kitchenStatus]}`}>
                    {KITCHEN_STATUS_LABELS[order.kitchenStatus]}
                </span>
            </div>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[13px] lg:text-[14px]">
                {rows.map(([label, value]) => (
                    <div key={label} className="contents">
                        <dt className="text-[#8e9993]">{label}</dt>
                        <dd className="m-0 break-words text-[#e9e7e1] capitalize">{value}</dd>
                    </div>
                ))}
            </dl>
            <ul className="m-0 flex list-none flex-col gap-1 border-t border-[#263831] p-0 pt-3 text-[13px] text-[#e9e7e1] lg:text-[14px]">
                {order.lines.map((line) => (
                    <li key={line.id} className="break-words">
                        {line.qty}× {line.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
