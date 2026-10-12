import type { ReactNode } from 'react'

type QueueAccordionProps = {
    title: string
    count: number
    defaultOpen?: boolean
    children: ReactNode
}

export default function QueueAccordion({ title, count, defaultOpen = false, children }: QueueAccordionProps) {
    return (
        <details open={defaultOpen} className="group rounded-2xl border border-[#263831] bg-[#101a19]">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[14px] font-medium text-[#f3efe8] marker:hidden focus-visible:outline-2 focus-visible:outline-[#d9c08e] lg:text-[16px] [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="text-[#8e9993] transition-transform group-open:rotate-90">▸</span>
                {title}
                <span className="ml-auto rounded-full bg-[rgba(217,192,142,0.16)] px-2 py-0.5 text-[11px] text-[#d9c08e]">{count}</span>
            </summary>
            <div className="px-3 pb-3">{children}</div>
        </details>
    )
}
