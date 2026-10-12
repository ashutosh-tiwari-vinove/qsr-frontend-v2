import type { ReactNode } from 'react'

type QueueStatusCardProps = {
    title: string
    hint?: string
    action?: ReactNode
}

export default function QueueStatusCard({ title, hint, action }: QueueStatusCardProps) {
    return (
        <div role="status" className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#263831] bg-[#151c1b] px-6 py-10 text-center">
            <p className="m-0 text-[14px] text-[#f3efe8] lg:text-[16px]">{title}</p>
            {hint && <p className="m-0 text-[12px] text-[#8e9993] lg:text-[14px]">{hint}</p>}
            {action}
        </div>
    )
}
