import type { ReactNode } from 'react'
import { env } from '../config/env'

type Portal = { path: string; label: string; description: string; icon: ReactNode }

const iconProps = {
    'aria-hidden': true,
    viewBox: '0 0 24 24',
    fill: 'none',
    className: 'size-6 stroke-current',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const

const PORTALS: Portal[] = [
    {
        path: '/customer',
        label: 'Customer',
        description: 'Browse the menu and place an order',
        icon: (
            <svg {...iconProps}>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
        ),
    },
    {
        path: '/kitchen',
        label: 'Kitchen',
        description: 'Track and update incoming orders',
        icon: (
            <svg {...iconProps}>
                <path d="M7 14a4 4 0 1 1 1.5-7.7A4 4 0 0 1 16 6.3 4 4 0 0 1 17 14" />
                <path d="M7 14v6h10v-6" />
            </svg>
        ),
    },
    {
        path: '/ops',
        label: 'Ops',
        description: 'Manage the queue and order details',
        icon: (
            <svg {...iconProps}>
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <path d="M8 20h8M12 16v4" />
                <path d="m7 11 3-3 3 2 4-4" />
            </svg>
        ),
    },
]

export default function LandingPage() {
    return (
        <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center gap-8 px-4 py-10">
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="grid size-16 place-items-center rounded-2xl border border-[rgba(200,169,106,0.55)] bg-[#0c2c24]">
                    <img src="/logo/logo.svg" alt="" className="size-14 object-contain" />
                </div>
                <h1 className="m-0 font-serif text-[28px] text-[#f3efe8] lg:text-[34px]">{env.resturantName}</h1>
                <p className="m-0 text-[13px] text-[#c7d1cc]">Choose a portal to open in a new tab</p>
            </div>

            <nav aria-label="Portals" className="grid w-full gap-3 min-[640px]:grid-cols-3">
                {PORTALS.map(({ path, label, description, icon }) => (
                    <a
                        key={path}
                        href={path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-3 rounded-2xl border border-[#263831] bg-[#101a19] p-6 text-center no-underline transition-colors hover:border-[rgba(217,192,142,0.42)] hover:bg-[#14231f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e]"
                    >
                        <span className="grid size-12 place-items-center rounded-xl bg-[#d9c08e] text-[#0c2c24]">{icon}</span>
                        <span className="font-serif text-[20px] text-[#f3efe8]">{label}</span>
                        <span className="text-[12px] text-[#8e9993]">{description}</span>
                    </a>
                ))}
            </nav>
        </main>
    )
}
