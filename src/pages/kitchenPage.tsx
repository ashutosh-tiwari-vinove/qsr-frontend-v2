import KitchenHeader from '../components/kitchen/header/KitchenHeader'
import OrderQueue from '../components/kitchen/orderQueue/OrderQueue'
import KitchenChat from '../components/kitchen/kitchenChat/KitchenChat'

function KitchenPage() {
    return (
        <div className="flex min-h-dvh flex-col bg-[#0d1413]">
            <KitchenHeader />
            <main className="mx-auto flex w-full max-w-6xl min-w-0 flex-1 gap-4 px-4 py-4 max-[860px]:flex-col lg:gap-6 lg:px-10 lg:py-8">
                <OrderQueue />
                <KitchenChat />
            </main>
        </div>
    )
}

export default KitchenPage
