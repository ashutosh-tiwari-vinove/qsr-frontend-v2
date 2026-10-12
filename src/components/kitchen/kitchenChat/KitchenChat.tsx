import { useKitchenStore } from '../../../store/kitchen.store'
import ChatBubble from '../../chat/chatBubble/ChatBubble'
import ChatPanel from '../../chat/ChatPanel'
import OrderStatusCard from './OrderStatusCard'

export default function KitchenChat() {
    const messages = useKitchenStore((state) => state.messages)
    const isSubmitting = useKitchenStore((state) => state.isSubmitting)
    const sendMessage = useKitchenStore((state) => state.sendMessage)

    return (
        <ChatPanel
            avatar="K"
            title="Kitchen Assistant"
            subtitle="Update order status by typing"
            placeholder="e.g. order 12 is ready"
            isSubmitting={isSubmitting}
            messageCount={messages.length}
            onSend={sendMessage}
        >
            {messages.map((message) =>
                message.kind === 'status' ? (
                    <OrderStatusCard key={message.id} orderId={message.orderId} status={message.status} />
                ) : (
                    <ChatBubble key={message.id} role={message.sender === 'user' ? 'user' : 'assistant'} message={message.text} />
                ),
            )}
        </ChatPanel>
    )
}
