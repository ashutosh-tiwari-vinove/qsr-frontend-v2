type QuantityStepperProps = {
    value: number
    onChange: (value: number) => void
    /** Accessible name of the item being counted, e.g. "Paneer Butter Masala". */
    label: string
    min?: number
    max?: number
}

const BUTTON_CLASSES =
    'grid size-8 cursor-pointer place-items-center rounded-full text-[#6fc9a4] transition-[background-color,transform,color] duration-150 ease-out hover:bg-[#6fc9a4]/15 hover:text-[#9be3c3] focus-visible:outline-2 focus-visible:outline-[#d9c08e] active:scale-90 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none'

export default function QuantityStepper({ value, onChange, label, min = 1, max = 99 }: QuantityStepperProps) {
    return (
        <div role="group" aria-label={`Quantity of ${label}`} className="inline-flex w-fit items-center gap-1 self-start rounded-full bg-[#1d2a25] p-1">
            <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={BUTTON_CLASSES}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4 stroke-current" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14" />
                </svg>
            </button>
            <output aria-live="polite" className="min-w-8 text-center text-[15px] font-semibold text-[#f3efe8] tabular-nums">
                {value}
            </output>
            <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={BUTTON_CLASSES}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4 stroke-current" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            </button>
        </div>
    )
}
