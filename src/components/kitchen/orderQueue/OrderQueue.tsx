import { useEffect } from 'react'
import { useKitchenStore } from '../../../store/kitchen.store'
import OrderCard from './OrderCard'
import QueueStatusCard from './QueueStatusCard'

function QueueSkeleton() {
    return (
        <div aria-hidden="true" className="flex flex-col gap-3">
            {[0, 1, 2].map((key) => (
                <div key={key} className="h-32 animate-pulse rounded-2xl border border-[#263831] bg-[#151c1b]" />
            ))}
        </div>
    )
}

export default function OrderQueue() {
    const orders = useKitchenStore((state) => state.orders)
    const isLoading = useKitchenStore((state) => state.isLoading)
    const loadError = useKitchenStore((state) => state.loadError)
    const isSubmitting = useKitchenStore((state) => state.isSubmitting)
    const loadOrders = useKitchenStore((state) => state.loadOrders)
    const setStatus = useKitchenStore((state) => state.setStatus)

    useEffect(() => {
        void loadOrders()
    }, [loadOrders])

    return (
        <section aria-labelledby="kitchen-queue-title" className="flex min-w-0 flex-[1.2] flex-col gap-4 rounded-2xl border border-[#263831] bg-[#101a19] p-4 min-[861px]:h-[calc(100dvh-68px-2rem)] lg:min-[861px]:h-[calc(100dvh-84px-4rem)] lg:p-5">
            <div>
                <h2 id="kitchen-queue-title" className="m-0 font-serif text-[20px] text-[#f3efe8] lg:text-[24px]">Kitchen Queue</h2>
                <p className="m-0 mt-0.5 text-[12px] text-[#8e9993] lg:text-[14px]">
                    {orders.length} active {orders.length === 1 ? 'order' : 'orders'}
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                {isLoading ? (
                    <QueueSkeleton />
                ) : loadError ? (
                    <QueueStatusCard
                        title={loadError}
                        action={
                            <button
                                type="button"
                                onClick={() => void loadOrders()}
                                className="mt-2 cursor-pointer rounded-full border border-[rgba(217,192,142,0.42)] px-4 py-1.5 text-[12px] text-[#f3dfb5] transition-colors hover:bg-[rgba(217,192,142,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e]"
                            >
                                Retry
                            </button>
                        }
                    />
                ) : orders.length === 0 ? (
                    <QueueStatusCard title="No active orders right now." />
                ) : (
                    <ul className="m-0 flex list-none flex-col gap-3 p-0">
                        {orders.map((order) => (
                            <OrderCard key={order.orderId} order={order} disabled={isSubmitting} onStatusChange={setStatus} />
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}
