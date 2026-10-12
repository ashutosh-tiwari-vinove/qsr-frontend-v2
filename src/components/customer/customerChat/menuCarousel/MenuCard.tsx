import { useState } from 'react'
import type { MenuItem } from '../../../../api/api'
import { formatPrice, getCustomizationHint, getDietType, hasCustomizations } from './menuCarousel.utils'
import type { DietType } from './menuCarousel.utils'

type MenuCardProps = {
    item: MenuItem
    currencySymbol?: string
    /** Position in the list, used to stagger the entrance animation. */
    index: number
    /** Called for both Add and Choose; the caller opens the matching selection card. */
    onSelect: (item: MenuItem) => void
}

const DIET_STYLES: Record<DietType, { label: string; border: string; dot: string }> = {
    veg: { label: 'Vegetarian', border: 'border-[#2f9e5b]', dot: 'bg-[#2f9e5b]' },
    nonVeg: { label: 'Non-vegetarian', border: 'border-[#d9453a]', dot: 'bg-[#d9453a]' },
}

function DietBadge({ diet }: { diet: DietType }) {
    const { label, border, dot } = DIET_STYLES[diet]
    return (
        <span
            role="img"
            aria-label={label}
            title={label}
            className={`absolute top-2.5 right-2.5 grid size-5 place-items-center rounded-[5px] border-2 bg-white shadow-sm ${border}`}
        >
            <span className={`size-2.5 rounded-full ${dot}`} />
        </span>
    )
}

function ImagePlaceholder() {
    return (
        <div role="img" aria-label="Image unavailable" className="grid size-full place-items-center bg-[#1d2a25] text-[#8e9993]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-9 stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3v8a2 2 0 0 0 2 2v8" />
                <path d="M5 3v6" />
                <path d="M9 3v6" />
                <path d="M17 21V3c-2.5 1.5-4 4-4 8v2h4" />
            </svg>
        </div>
    )
}

export default function MenuCard({ item, currencySymbol, index, onSelect }: MenuCardProps) {
    const [imageFailed, setImageFailed] = useState(false)
    const diet = getDietType(item)
    const needsChoice = hasCustomizations(item)

    return (
        <article
            style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
            className="group w-[200px] flex-none snap-start animate-[bubble-in_320ms_ease-out_both] overflow-hidden rounded-2xl border border-[#263831] bg-[#151c1b] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#d9c08e]/40 hover:shadow-[0_14px_30px_rgba(0,0,0,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-[230px]"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#1d2a25]">
                {imageFailed || !item.image_url ? (
                    <ImagePlaceholder />
                ) : (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                )}
                {item.is_favorite && (
                    <span className="absolute top-2.5 left-2.5 rounded-full border border-[#d9c08e]/50 bg-[#2a2517]/90 px-2.5 py-1 text-[11px] leading-none font-medium text-[#f3dfb5] backdrop-blur-sm">
                        Popular
                    </span>
                )}
                {diet && <DietBadge diet={diet} />}
            </div>

            <div className="flex flex-col gap-1 p-3.5">
                <h3 title={item.name} className="truncate font-sans text-[15px] leading-6 font-semibold tracking-normal text-[#f3efe8] lg:text-[16px]">
                    {item.name}
                </h3>
                <p className="truncate text-[12px] leading-5 text-[#8e9993] lg:text-[13px]">
                    {getCustomizationHint(item)}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[16px] font-semibold text-[#f3efe8] lg:text-[18px]">
                        {formatPrice(item, currencySymbol)}
                    </span>
                    <button
                        type="button"
                        aria-label={`${needsChoice ? 'Choose options for' : 'Add'} ${item.name}`}
                        onClick={() => onSelect(item)}
                        className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#1f5a48] px-4 text-[13px] font-semibold text-[#f3efe8] transition-[background-color,transform,box-shadow] duration-200 ease-out hover:bg-[#287358] hover:shadow-[0_4px_12px_rgba(40,115,88,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e] active:scale-95 motion-reduce:transition-none"
                    >
                        {!needsChoice && (
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-3.5 stroke-current" strokeWidth="2.2" strokeLinecap="round">
                                <path d="M12 5v14" />
                                <path d="M5 12h14" />
                            </svg>
                        )}
                        {needsChoice ? 'Choose' : 'Add'}
                    </button>
                </div>
            </div>
        </article>
    )
}
