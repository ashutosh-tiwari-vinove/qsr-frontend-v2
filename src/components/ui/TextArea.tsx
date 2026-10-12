import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, TextareaHTMLAttributes } from 'react'

type TextAreaProps = Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'defaultValue' | 'onChange' | 'onSubmit' | 'rows'
> & {
    /** Called with the trimmed text on Enter or send-button click. May be async. */
    onSubmit: (value: string) => void | Promise<void>
    placeholder?: string
    /** Accessible name for the field (visually hidden). */
    label?: string
    /** Accessible name for the send button. */
    submitLabel?: string
    /** Controlled value. Omit to let the component manage its own state. */
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
    /** Shows a spinner on the send button and blocks further submits. */
    loading?: boolean
    /** Keep the text after submitting (default clears it on success). */
    keepValueOnSubmit?: boolean
    /** Maximum number of rows the field grows to before scrolling. */
    maxRows?: number
    className?: string
}

const LINE_HEIGHT_PX = 24

export default function TextArea({
    onSubmit,
    placeholder = 'Type a message…',
    label = 'Message',
    submitLabel = 'Send message',
    value: controlledValue,
    onChange,
    disabled = false,
    loading = false,
    keepValueOnSubmit = false,
    maxRows = 5,
    className = '',
    ...rest
}: TextAreaProps) {
    const id = useId()
    const ref = useRef<HTMLTextAreaElement>(null)
    const [innerValue, setInnerValue] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : innerValue
    const trimmed = value.trim()
    const busy = loading || submitting
    const canSubmit = trimmed.length > 0 && !disabled && !busy

    const setValue = useCallback(
        (next: string) => {
            if (!isControlled) setInnerValue(next)
            onChange?.(next)
        },
        [isControlled, onChange],
    )

    // Auto-grow with content, capped at maxRows.
    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight, LINE_HEIGHT_PX * maxRows)}px`
    }, [value, maxRows])

    const submit = useCallback(async () => {
        if (!canSubmit) return
        setSubmitting(true)
        try {
            await onSubmit(trimmed)
            if (!keepValueOnSubmit) setValue('')
        } catch (error) {
            // Keep the user's text so they can retry; surface the error to the caller's logging.
            console.error('TextArea submit failed', error)
        } finally {
            setSubmitting(false)
            ref.current?.focus()
        }
    }, [canSubmit, onSubmit, trimmed, keepValueOnSubmit, setValue])

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        rest.onKeyDown?.(event)
        if (event.defaultPrevented) return
        // Enter submits; Shift+Enter inserts a newline; ignore Enter while an IME is composing.
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            void submit()
        }
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                void submit()
            }}
            aria-busy={busy}
            className={`group flex w-full items-end gap-2 rounded-[28px] border border-[#2a3a34] bg-[#161f1c] py-2 pr-2 pl-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-within:border-[#d9c08e]/60 focus-within:bg-[#1a2420] focus-within:shadow-[0_0_0_3px_rgba(217,192,142,0.12),0_8px_24px_rgba(0,0,0,0.25)] ${disabled ? 'opacity-60' : ''} ${className}`}
        >
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <textarea
                {...rest}
                id={id}
                ref={ref}
                rows={1}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                style={{ maxHeight: LINE_HEIGHT_PX * maxRows }}
                className="min-h-[40px] flex-1 resize-none self-center bg-transparent py-2 text-[14px] leading-6 text-[#f3efe8] outline-none transition-colors duration-200 placeholder:text-[#8e9993] placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-60 disabled:cursor-not-allowed lg:text-[16px]"
            />
            <button
                type="submit"
                aria-label={submitLabel}
                disabled={!canSubmit}
                className={`grid size-10 flex-none place-items-center rounded-full text-[#f3efe8] transition-[background-color,transform,opacity,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3dfb5] lg:size-11 ${
                    canSubmit
                        ? 'bg-[#f16b4e] shadow-[0_4px_14px_rgba(241,107,78,0.35)] hover:scale-105 hover:bg-[#ff8062] active:scale-95'
                        : 'cursor-not-allowed bg-[#6b3f36] opacity-70'
                }`}
            >
                {busy ? (
                    <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    />
                ) : (
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`size-[18px] stroke-current transition-transform duration-200 ease-out ${canSubmit ? 'group-focus-within:translate-x-0.5' : ''}`}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                    </svg>
                )}
            </button>
        </form>
    )
}
