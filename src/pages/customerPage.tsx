import { useState } from 'react'
import CustomerHeader from '../components/customer/header/CustomerHeader'
import CartDrawer from "../components/customer/cartDrawer/CartDrawer"
import CustomerChat from '../components/customer/customerChat'

function CustomerPage() {
    const [cartOpen, setCartOpen] = useState(false)

    return (
        <div className="flex min-h-dvh flex-col bg-[#0d1413]">
            <CustomerHeader cartOpen={cartOpen} onCartOpen={() => setCartOpen(true)} />
            <CustomerChat />
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    )
}

export default CustomerPage