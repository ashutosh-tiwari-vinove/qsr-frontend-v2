import type { ButtonHTMLAttributes } from 'react'

export type PillVariant = 'suggestions' | 'showMenu'

type PillProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> & {
    variant?: PillVariant
    label: string
    onClick?: () => void
    /** Marks the pill as the active choice (suggestions only). Omit for plain, non-toggle pills. */
    selected?: boolean
}

const BASE =
    'inline-flex flex-none items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50'

const VARIANTS: Record<PillVariant, string> = {
    // Quick-reply chips shown above the chat input.
    suggestions:
        'min-h-[36px] border border-[#2a3a34] bg-[#161f1c] px-4 text-[13px] text-[#f3efe8] hover:-translate-y-0.5 hover:border-[#d9c08e]/50 hover:bg-[#1d2a25] focus-visible:outline-[#d9c08e] lg:min-h-[40px] lg:px-5 lg:text-[14px]',
    // Primary call-to-action that opens the menu.
    showMenu:
        'min-h-[37px] bg-[#f16b4e] px-4 text-[12px] text-[#1b211e] shadow-[0_4px_14px_rgba(241,107,78,0.3)] hover:bg-[#ff8062] focus-visible:outline-[#f3dfb5] lg:min-h-[46px] lg:px-6 lg:text-[14px]',
}

const SELECTED = 'border-[#d9c08e] bg-[#24342d] text-[#f3dfb5]'

export default function Pill({
    variant = 'suggestions',
    label,
    onClick,
    selected,
    type = 'button',
    className = '',
    ...rest
}: PillProps) {
    const isSuggestion = variant === 'suggestions'

    return (
        <button
            {...rest}
            type={type}
            onClick={onClick}
            aria-pressed={isSuggestion ? selected : undefined}
            className={`${BASE} ${VARIANTS[variant]} ${isSuggestion && selected ? SELECTED : ''} ${className} cursor-pointer`}
        >
            {label}
            {variant === 'showMenu' && (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-3.5 stroke-current lg:size-4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                </svg>
            )}
        </button>
    )
}
