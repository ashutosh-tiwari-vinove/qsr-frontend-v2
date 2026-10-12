import { useId, useState } from 'react'
import { useCurrencyStore } from '../../../../store/currency.store'
import QuantityStepper from '../../../ui/QuantityStepper'
import { formatPrice, getCustomizations, getDietType } from '../menuCarousel/menuCarousel.utils'
import OptionGroup from './OptionGroup'
import { MAX_NOTE_LENGTH, getMissingRequired, getTotalPrice } from './dishSelection.utils'
import type { DishDraft } from './dishSelection.utils'

type DishSelectionCardProps = {
    draft: DishDraft
    /** Briefly rings the card when the customer picks a dish that is already open. */
    highlighted: boolean
    onQuantityChange: (quantity: number) => void
    onToggleOption: (attributeName: string, value: string) => void
    onNoteChange: (note: string) => void
    onCancel: () => void
    onConfirm: () => void
}

const DIET_LABELS = { veg: 'vegetarian', nonVeg: 'non-vegetarian' } as const

export default function DishSelectionCard({
    draft,
    highlighted,
    onQuantityChange,
    onToggleOption,
    onNoteChange,
    onCancel,
    onConfirm,
}: DishSelectionCardProps) {
    const noteId = useId()
    const [imageFailed, setImageFailed] = useState(false)
    const currencySymbol = useCurrencyStore((state) => state.currency?.symbol)

    const { item } = draft
    const customizations = getCustomizations(item)
    const diet = getDietType(item)
    const missing = getMissingRequired(draft)
    const canConfirm = missing.length === 0
    const total = { ...item, list_price: getTotalPrice(draft) }

    return (
        <section
            id={`dish-card-${draft.draftId}`}
            aria-label={`Set up ${item.name}`}
            className={`w-full max-w-[35rem] animate-[bubble-in_260ms_ease-out] overflow-hidden rounded-2xl border bg-[#151c1b] text-[#f3efe8] shadow-[0_14px_30px_rgba(0,0,0,0.25)] transition-[border-color,box-shadow] duration-500 ${highlighted ? 'border-[#d9c08e] shadow-[0_0_0_3px_rgba(217,192,142,0.25)]' : 'border-[#263831]'}`}
        >
            <header className="flex items-center gap-3 border-b border-[#263831] p-4">
                <div className="size-[52px] flex-none overflow-hidden rounded-lg bg-[#1d2a25]">
                    {imageFailed || !item.image_url ? (
                        <div role="img" aria-label="Image unavailable" className="grid size-full place-items-center text-[#8e9993]">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6 stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 3v8a2 2 0 0 0 2 2v8" />
                                <path d="M5 3v6" />
                                <path d="M9 3v6" />
                                <path d="M17 21V3c-2.5 1.5-4 4-4 8v2h4" />
                            </svg>
                        </div>
                    ) : (
                        <img src={item.image_url} alt="" onError={() => setImageFailed(true)} className="size-full object-cover" />
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="truncate font-serif text-[20px] leading-7 text-[#f7f3eb]">{item.name}</h3>
                    <p className="truncate text-[13px] text-[#a9b4ae]">
                        {formatPrice(item, currencySymbol)} each{diet ? `, ${DIET_LABELS[diet]}` : ''}
                    </p>
                </div>
            </header>

            <div className="flex flex-col gap-5 p-4">
                <div className="flex flex-col gap-2.5">
                    <p className="text-[14px] font-semibold">Quantity</p>
                    <QuantityStepper value={draft.quantity} onChange={onQuantityChange} label={item.name} />
                </div>

                {customizations.map((attribute) => (
                    <OptionGroup
                        key={attribute.name}
                        attribute={attribute}
                        selected={draft.selections[attribute.name] ?? []}
                        currencySymbol={currencySymbol}
                        onToggle={(value) => onToggleOption(attribute.name, value)}
                    />
                ))}

                <div className="flex flex-col gap-2.5">
                    <label htmlFor={noteId} className="flex items-baseline gap-2 text-[14px] font-semibold">
                        Note for the kitchen
                        <span className="text-[12px] font-normal text-[#8e9993]">Optional</span>
                    </label>
                    <textarea
                        id={noteId}
                        rows={3}
                        value={draft.note}
                        maxLength={MAX_NOTE_LENGTH}
                        onChange={(event) => onNoteChange(event.target.value)}
                        placeholder="Allergies or cooking instructions"
                        className="w-full resize-none rounded-xl border border-[#2a3a34] bg-[#1a2420] px-3.5 py-3 text-[14px] leading-5 text-[#f3efe8] transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-[#8e9993] focus:border-[#d9c08e]/60 focus:shadow-[0_0_0_3px_rgba(217,192,142,0.12)]"
                    />
                </div>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#263831] px-4 py-3">
                <div className="min-w-0">
                    <p className="text-[18px] font-semibold">{formatPrice(total, currencySymbol)}</p>
                    {!canConfirm && (
                        <p role="status" className="text-[12px] text-[#f08a73]">
                            Select {missing.map((name) => name.toLowerCase()).join(', ')}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="min-h-10 cursor-pointer rounded-full px-4 text-[14px] font-medium text-[#f08a73] transition-[background-color,transform] duration-200 hover:bg-[#f08a73]/10 focus-visible:outline-2 focus-visible:outline-[#d9c08e] active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!canConfirm}
                        onClick={onConfirm}
                        className="min-h-11 cursor-pointer rounded-full bg-[#f16b4e] px-6 text-[14px] font-medium text-[#1b211e] shadow-[0_4px_14px_rgba(241,107,78,0.3)] transition-[background-color,transform,box-shadow,opacity] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#ff8062] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3dfb5] active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Add to order
                    </button>
                </div>
            </footer>
        </section>
    )
}
