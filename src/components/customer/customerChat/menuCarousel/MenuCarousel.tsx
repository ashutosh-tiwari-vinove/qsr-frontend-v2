import type { KeyboardEvent, ReactNode } from 'react'
import type { MenuItem } from '../../../../api/api'
import { useCurrencyStore } from '../../../../store/currency.store'
import { useMenuStore } from '../../../../store/menu.store'
import MenuCard from './MenuCard'
import MenuCardSkeleton from './MenuCardSkeleton'
import { useCarouselScroll } from './useCarouselScroll'

type MenuCarouselProps = {
    isLoading: boolean
    error: string | null
    onRetry: () => void
    onSelect: (item: MenuItem) => void
}

const SKELETON_COUNT = 4

function StatusCard({ icon, title, hint, action }: { icon: ReactNode; title: string; hint: string; action?: ReactNode }) {
    return (
        <div
            role="status"
            className="flex w-full animate-[bubble-in_220ms_ease-out] flex-col items-center gap-2 rounded-2xl border border-dashed border-[#263831] bg-[#151c1b] px-6 py-10 text-center"
        >
            <span className="grid size-12 place-items-center rounded-full bg-[#1d2a25] text-[#d9c08e]">{icon}</span>
            <p className="text-[15px] font-semibold text-[#f3efe8]">{title}</p>
            <p className="max-w-sm text-[13px] leading-5 text-[#8e9993]">{hint}</p>
            {action}
        </div>
    )
}

const ICON_PROPS = {
    'aria-hidden': true,
    viewBox: '0 0 24 24',
    fill: 'none',
    className: 'size-6 stroke-current',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const

const ErrorIcon = () => (
    <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16.5h.01" />
    </svg>
)

const EmptyIcon = () => (
    <svg {...ICON_PROPS}>
        <path d="M7 3v8a2 2 0 0 0 2 2v8" />
        <path d="M5 3v6" />
        <path d="M9 3v6" />
        <path d="M17 21V3c-2.5 1.5-4 4-4 8v2h4" />
    </svg>
)

function ArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
    const isPrev = direction === 'prev'
    return (
        <button
            type="button"
            aria-label={isPrev ? 'Scroll menu left' : 'Scroll menu right'}
            onClick={onClick}
            className={`absolute top-[38%] hidden size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[#2a3a34] bg-[#101a19]/90 text-[#f3efe8] shadow-lg backdrop-blur-sm transition-[background-color,transform,border-color] duration-200 hover:scale-110 hover:border-[#d9c08e]/60 hover:bg-[#1f2d28] focus-visible:outline-2 focus-visible:outline-[#d9c08e] active:scale-95 lg:grid ${isPrev ? 'left-1' : 'right-1'}`}
        >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-[18px] stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={isPrev ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
            </svg>
        </button>
    )
}

export default function MenuCarousel({ isLoading, error, onRetry, onSelect }: MenuCarouselProps) {
    const items = useMenuStore((state) => state.items)
    const currencySymbol = useCurrencyStore((state) => state.currency?.symbol)
    const { trackRef, scrollByPage, canScrollPrev, canScrollNext, thumbWidth, thumbOffset } =
        useCarouselScroll<HTMLDivElement>(items.length)

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowRight') scrollByPage(1)
        else if (event.key === 'ArrowLeft') scrollByPage(-1)
        else return
        event.preventDefault()
    }

    // The store may already hold a previous result, so only block on loading when it is empty.
    if (items.length === 0 && isLoading) {
        return (
            <div aria-busy="true" aria-label="Loading menu" className="flex gap-4 overflow-hidden">
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <MenuCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (items.length === 0 && error) {
        return (
            <StatusCard
                icon={<ErrorIcon />}
                title="Couldn't load the menu"
                hint="Something went wrong while fetching our dishes. Please check your connection and try again."
                action={
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-2 inline-flex min-h-9 cursor-pointer items-center rounded-full border border-[#d9c08e]/50 px-5 text-[13px] font-medium text-[#f3dfb5] transition-[background-color,transform] duration-200 hover:bg-[#d9c08e]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e] active:scale-95"
                    >
                        Try again
                    </button>
                }
            />
        )
    }

    if (items.length === 0) {
        return (
            <StatusCard
                icon={<EmptyIcon />}
                title="The menu is empty right now"
                hint="Our kitchen hasn't published any dishes yet. Please check back in a little while."
            />
        )
    }

    return (
        <section aria-label="Menu" className="relative w-full min-w-0">
            <div
                ref={trackRef}
                tabIndex={0}
                role="region"
                aria-label="Menu items, use left and right arrow keys to browse"
                onKeyDown={handleKeyDown}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth rounded-2xl pb-3 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9c08e]/60 motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
            >
                {items.map((item, index) => (
                    <MenuCard
                        key={item.id}
                        item={item}
                        index={index}
                        currencySymbol={currencySymbol}
                        onSelect={onSelect}
                    />
                ))}
            </div>

            {canScrollPrev && <ArrowButton direction="prev" onClick={() => scrollByPage(-1)} />}
            {canScrollNext && <ArrowButton direction="next" onClick={() => scrollByPage(1)} />}

            {thumbWidth < 100 && (
                <div aria-hidden="true" className="mx-auto mt-2 h-[3px] w-28 overflow-hidden rounded-full bg-[#1d2a25]">
                    <div
                        className="h-full rounded-full bg-[#2f8f6f] transition-[margin,width] duration-150 ease-out"
                        style={{ width: `${thumbWidth}%`, marginLeft: `${thumbOffset}%` }}
                    />
                </div>
            )}
        </section>
    )
}
