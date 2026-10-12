import ProgressStepper from '../../ui/ProgressStepper'
import type { ProgressStep } from '../../ui/ProgressStepper'
import { KITCHEN_STATUS_SEQUENCE } from '../kitchen.types'
import type { KitchenStatus } from '../kitchen.types'
import { KITCHEN_STATUS_COPY, KITCHEN_STATUS_LABELS } from '../kitchen.utils'

type OrderStatusCardProps = {
    orderId: number
    status: KitchenStatus
}

const STEPS: ProgressStep[] = KITCHEN_STATUS_SEQUENCE.map((status) => ({
    key: status,
    label: KITCHEN_STATUS_LABELS[status],
}))

export default function OrderStatusCard({ orderId, status }: OrderStatusCardProps) {
    return (
        <div className="flex w-full max-w-[min(42rem,100%)] animate-[bubble-in_220ms_ease-out] flex-col gap-4 rounded-2xl border border-[#263831] bg-[#151c1b] px-4 py-4 lg:px-5 lg:py-5">
            <p className="m-0 text-[14px] leading-6 text-[#e9e7e1] lg:text-[16px]">
                Order <strong className="text-[#f3dfb5]">#{orderId}</strong> {KITCHEN_STATUS_COPY[status]}
            </p>
            <ProgressStepper steps={STEPS} currentIndex={KITCHEN_STATUS_SEQUENCE.indexOf(status)} label={`Order ${orderId} progress`} />
        </div>
    )
}
