import { useOpsStore } from '../../../store/ops.store'
import ChatBubble from '../../chat/chatBubble/ChatBubble'
import ChatPanel from '../../chat/ChatPanel'
import OrderDetailCard from './OrderDetailCard'

export default function OpsChat() {
    const messages = useOpsStore((state) => state.messages)
    const isSubmitting = useOpsStore((state) => state.isSubmitting)
    const sendMessage = useOpsStore((state) => state.sendMessage)

    return (
        <ChatPanel
            avatar="O"
            title="Ops Assistant"
            subtitle="Update orders or place a new one"
            placeholder="Type a command or an order…"
            isSubmitting={isSubmitting}
            messageCount={messages.length}
            onSend={sendMessage}
        >
            {messages.map((message) =>
                message.kind === 'detail' ? (
                    <OrderDetailCard key={message.id} order={message.order} />
                ) : (
                    <ChatBubble key={message.id} role={message.sender === 'user' ? 'user' : 'assistant'} message={message.text} />
                ),
            )}
        </ChatPanel>
    )
}
