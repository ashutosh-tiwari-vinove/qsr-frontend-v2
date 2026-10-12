import { useEffect, useMemo } from 'react'
import { useOpsStore } from '../../../store/ops.store'
import QueueStatusCard from '../../kitchen/orderQueue/QueueStatusCard'
import { bucketOrders, summarizeQueue } from '../ops.utils'
import OpsOrderCard from './OpsOrderCard'
import QueueAccordion from './QueueAccordion'

export default function OpsQueuePanel() {
    const orders = useOpsStore((state) => state.orders)
    const isLoading = useOpsStore((state) => state.isLoading)
    const loadError = useOpsStore((state) => state.loadError)
    const busy = useOpsStore((state) => state.busy)
    const loadQueue = useOpsStore((state) => state.loadQueue)
    const approveBill = useOpsStore((state) => state.approveBill)
    const cancelOrder = useOpsStore((state) => state.cancelOrder)

    useEffect(() => {
        void loadQueue()
    }, [loadQueue])

    const queue = useMemo(() => bucketOrders(orders), [orders])

    return (
        <section aria-labelledby="ops-queue-title" className="flex min-w-0 flex-[1.2] flex-col gap-4 rounded-2xl border border-[#263831] bg-[#101a19] p-4 min-[861px]:h-[calc(100dvh-68px-2rem)] lg:p-5 lg:min-[861px]:h-[calc(100dvh-84px-4rem)]">
            <div>
                <h2 id="ops-queue-title" className="m-0 font-serif text-[20px] text-[#f3efe8] lg:text-[24px]">Operations Queue</h2>
                <p className="m-0 mt-0.5 text-[12px] text-[#8e9993] lg:text-[14px]">{summarizeQueue(queue)}</p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                {isLoading ? (
                    <div aria-hidden="true" className="flex flex-col gap-3">
                        {[0, 1, 2].map((key) => (
                            <div key={key} className="h-28 animate-pulse rounded-2xl border border-[#263831] bg-[#151c1b]" />
                        ))}
                    </div>
                ) : loadError ? (
                    <QueueStatusCard
                        title={loadError}
                        action={
                            <button
                                type="button"
                                onClick={() => void loadQueue()}
                                className="mt-2 cursor-pointer rounded-full border border-[rgba(217,192,142,0.42)] px-4 py-1.5 text-[12px] text-[#f3dfb5] transition-colors hover:bg-[rgba(217,192,142,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e]"
                            >
                                Retry
                            </button>
                        }
                    />
                ) : (
                    <>
                        <QueueAccordion title="Active" count={queue.active.length} defaultOpen>
                            {queue.active.length === 0 ? (
                                <QueueStatusCard title="No active orders right now." />
                            ) : (
                                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                    {queue.active.map((order) => (
                                        <OpsOrderCard key={order.orderId} order={order} disabled={busy} onCancel={cancelOrder} />
                                    ))}
                                </ul>
                            )}
                        </QueueAccordion>
                        <QueueAccordion title="Waiting" count={queue.waiting.length} defaultOpen>
                            {queue.waiting.length === 0 ? (
                                <QueueStatusCard title="No bills waiting for approval." />
                            ) : (
                                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                    {queue.waiting.map((order) => (
                                        <OpsOrderCard key={order.orderId} order={order} disabled={busy} onApproveBill={approveBill} onCancel={cancelOrder} />
                                    ))}
                                </ul>
                            )}
                        </QueueAccordion>
                        <QueueAccordion title="Completed" count={queue.completed.length}>
                            {queue.completed.length === 0 ? (
                                <QueueStatusCard title="No completed orders yet." />
                            ) : (
                                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                    {queue.completed.map((order) => (
                                        <OpsOrderCard key={order.orderId} order={order} disabled={busy} completed />
                                    ))}
                                </ul>
                            )}
                        </QueueAccordion>
                    </>
                )}
            </div>
        </section>
    )
}
