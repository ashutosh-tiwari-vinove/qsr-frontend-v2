import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import TextArea from '../ui/TextArea'
import TypingIndicator from './TypingIndicator'

const JUMP_THRESHOLD_PX = 120

type ChatPanelProps = {
    /** Single letter shown in the header avatar. */
    avatar: string
    title: string
    subtitle: string
    placeholder: string
    isSubmitting: boolean
    /** Changes whenever a message is added, so the log can scroll to the latest one. */
    messageCount: number
    onSend: (text: string) => void | Promise<void>
    /** The rendered messages. */
    children: ReactNode
}

export default function ChatPanel({ avatar, title, subtitle, placeholder, isSubmitting, messageCount, onSend, children }: ChatPanelProps) {
    const listRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)
    const [showJump, setShowJump] = useState(false)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messageCount, isSubmitting])

    const handleScroll = () => {
        const list = listRef.current
        if (!list) return
        setShowJump(list.scrollHeight - list.scrollTop - list.clientHeight > JUMP_THRESHOLD_PX)
    }

    return (
        <section aria-label={title} className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#263831] bg-[#101a19] max-[860px]:min-h-[420px] min-[861px]:h-[calc(100dvh-68px-2rem)] lg:min-[861px]:h-[calc(100dvh-84px-4rem)]">
            <div className="flex items-center gap-3 border-b border-[#263831] px-4 py-3 lg:px-5">
                <div aria-hidden="true" className="grid size-9 place-items-center rounded-[10px] bg-[#d9c08e] font-serif text-[14px] font-bold text-[#0c2c24]">{avatar}</div>
                <div>
                    <h2 className="m-0 font-serif text-[16px] text-[#f3efe8] lg:text-[18px]">{title}</h2>
                    <p className="m-0 text-[11px] text-[#8e9993] lg:text-[12px]">{subtitle}</p>
                </div>
            </div>

            <div ref={listRef} onScroll={handleScroll} role="log" aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 lg:p-5">
                {children}
                {isSubmitting && <TypingIndicator />}
                <div ref={endRef} />
            </div>

            {showJump && (
                <button
                    type="button"
                    aria-label="Jump to latest message"
                    onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })}
                    className="absolute right-4 bottom-24 grid size-9 cursor-pointer place-items-center rounded-full border border-[rgba(217,192,142,0.42)] bg-[#0c2c24] text-[#f3dfb5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e]"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4 stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="m6 13 6 6 6-6" />
                    </svg>
                </button>
            )}

            <div className="border-t border-[#263831] p-3 lg:p-4">
                <TextArea
                    label={`Message the ${title.toLowerCase()}`}
                    placeholder={isSubmitting ? 'Assistant is typing…' : placeholder}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    onSubmit={onSend}
                />
            </div>
        </section>
    )
}
