import { useEffect, useRef, useState } from 'react'
import type { MenuItem } from '../../../api/api'
import { useMenu } from '../../../hooks/useMenu'
import { useCartStore } from '../../../store/cart.store'
import ChatBubble from '../../chat/chatBubble/ChatBubble'
import Pill from '../../ui/button/Pill'
import TextArea from '../../ui/TextArea'
import DishSelectionCard from './dishSelection/DishSelectionCard'
import { toCartLine } from './dishSelection/dishSelection.utils'
import { useDishDrafts } from './dishSelection/useDishDrafts'
import MenuCarousel from './menuCarousel/MenuCarousel'
import WelcomeCard from './welcomeCard/WelcomeCard'

type ChatMessage =
    | { id: number; role: 'assistant' | 'user'; type: 'text'; text: string }
    | { id: number; role: 'assistant'; type: 'menu' }
    | { id: number; role: 'assistant'; type: 'dish'; draftId: string }

const CATEGORY_MESSAGES = {
    drinks: 'Show me drinks menu',
    vegetarian: 'Show me vegetarian menu',
} as const

const MENU_INTRO = "Here's our menu. Swipe through and tap Add or Choose to start your order."
const HIGHLIGHT_DURATION_MS = 1200

// A plain "show me the menu" request. Category requests (drinks, vegetarian) are not handled yet.
const isMenuRequest = (text: string) => /\bmenu\b/i.test(text) && !/\b(drinks?|vegetarian)\b/i.test(text)

export default function CustomerChat() {
    const { isLoading, error, refetch } = useMenu()
    const { drafts, openDraft, setQuantity, toggleOption, setNote, removeDraft } = useDishDrafts()
    const addLine = useCartStore((state) => state.addLine)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [highlightedDraftId, setHighlightedDraftId] = useState<string | null>(null)
    const nextId = useRef(0)
    const bottomRef = useRef<HTMLDivElement>(null)

    const newId = () => nextId.current++
    const appendMessages = (...added: ChatMessage[]) => setMessages((prev) => [...prev, ...added])

    // TODO: call the customer chat API here and append the assistant's reply.
    const handleSend = (text: string) => {
        const replies: ChatMessage[] = isMenuRequest(text) ? [{ id: newId(), role: 'assistant', type: 'menu' }] : []
        appendMessages({ id: newId(), role: 'user', type: 'text', text }, ...replies)
    }

    // Add and Choose both open one card per dish; picking a dish that is already open just points to its card.
    const handleSelectDish = (item: MenuItem) => {
        const existing = drafts.find((draft) => draft.item.id === item.id)
        if (existing) {
            document.getElementById(`dish-card-${existing.draftId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            setHighlightedDraftId(existing.draftId)
            return
        }

        const draft = openDraft(item)
        appendMessages(
            { id: newId(), role: 'user', type: 'text', text: `I'd like the ${item.name}` },
            { id: newId(), role: 'assistant', type: 'text', text: `Let's set up your ${item.name}.` },
            { id: newId(), role: 'assistant', type: 'dish', draftId: draft.draftId },
        )
    }

    const handleCancelDish = (draftId: string) => {
        removeDraft(draftId)
        setMessages((prev) => prev.filter((message) => message.type !== 'dish' || message.draftId !== draftId))
    }

    const handleConfirmDish = (draftId: string) => {
        const draft = drafts.find((entry) => entry.draftId === draftId)
        if (!draft) return

        addLine(toCartLine(draft))
        removeDraft(draftId)
        const confirmation = `Added ${draft.quantity} × ${draft.item.name} to your order.`
        setMessages((prev) =>
            prev.map((message) =>
                message.type === 'dish' && message.draftId === draftId
                    ? { id: message.id, role: 'assistant', type: 'text', text: confirmation }
                    : message,
            ),
        )
    }

    useEffect(() => {
        if (highlightedDraftId === null) return
        const timer = setTimeout(() => setHighlightedDraftId(null), HIGHLIGHT_DURATION_MS)
        return () => clearTimeout(timer)
    }, [highlightedDraftId])

    // Keep the latest message in view.
    useEffect(() => {
        if (messages.length === 0) return
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages])

    const renderMessage = (message: ChatMessage) => {
        if (message.type === 'menu') {
            return (
                <div key={message.id} className="flex min-w-0 flex-col gap-4">
                    <ChatBubble message={MENU_INTRO} />
                    <MenuCarousel isLoading={isLoading} error={error} onRetry={refetch} onSelect={handleSelectDish} />
                </div>
            )
        }

        if (message.type === 'dish') {
            const draft = drafts.find((entry) => entry.draftId === message.draftId)
            if (!draft) return null
            return (
                <DishSelectionCard
                    key={message.id}
                    draft={draft}
                    highlighted={highlightedDraftId === draft.draftId}
                    onQuantityChange={(quantity) => setQuantity(draft.draftId, quantity)}
                    onToggleOption={(attributeName, value) => {
                        const attribute = draft.item.attributes?.find((entry) => entry.name === attributeName)
                        if (attribute) toggleOption(draft.draftId, attribute, value)
                    }}
                    onNoteChange={(note) => setNote(draft.draftId, note)}
                    onCancel={() => handleCancelDish(draft.draftId)}
                    onConfirm={() => handleConfirmDish(draft.draftId)}
                />
            )
        }

        return <ChatBubble key={message.id} role={message.role} message={message.text} />
    }

    return (
        <main className="mx-auto flex w-full max-w-6xl min-w-0 flex-1 flex-col gap-4 px-4 py-4 lg:gap-6 lg:px-10 lg:py-8">
            <WelcomeCard
                onExploreMenu={() => handleSend('Show me your menu')}
                onSelectCategory={(category) => handleSend(CATEGORY_MESSAGES[category])}
            />
            <ChatBubble />
            {messages.map(renderMessage)}
            <div ref={bottomRef} className="scroll-mb-40" />
            <div className="sticky bottom-0 mt-auto flex flex-col gap-3 bg-linear-to-t from-[#0d1413] from-70% to-transparent pt-4 pb-1">
                {drafts.length > 0 && (
                    <div role="group" aria-label="Dishes being set up" className="flex flex-wrap gap-2">
                        {drafts.map((draft) => (
                            <Pill
                                key={draft.draftId}
                                variant="suggestions"
                                label={`Cancel ${draft.item.name}`}
                                onClick={() => handleCancelDish(draft.draftId)}
                            />
                        ))}
                    </div>
                )}
                <TextArea
                    onSubmit={handleSend}
                    placeholder="Ask for menu, dish or drink, e.g. 2 cold coffees with oat milk"
                    label="Message the dining assistant"
                />
            </div>
        </main>
    )
}
