import { useEffect } from 'react'
import { selectCartCount, selectCartTotal, useCartStore } from '../../../store/cart.store'
import { useCurrencyStore } from '../../../store/currency.store'
import { formatAmount } from '../../../utils/currency'
import CartLineItem from './CartLineItem'

type CartDrawerProps = {
	isOpen: boolean
	onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
	const lines = useCartStore((state) => state.lines)
	const itemCount = useCartStore(selectCartCount)
	const total = useCartStore(selectCartTotal)
	const setQuantity = useCartStore((state) => state.setQuantity)
	const setNote = useCartStore((state) => state.setNote)
	const removeLine = useCartStore((state) => state.removeLine)
	const currencySymbol = useCurrencyStore((state) => state.currency?.symbol)

	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	return (
		<div
			aria-hidden={!isOpen}
			inert={!isOpen}
			className={`fixed inset-0 z-50 flex justify-end transition-[visibility] duration-300 motion-reduce:duration-0 ${isOpen ? 'visible' : 'invisible delay-300 motion-reduce:delay-0'}`}
			role="presentation"
		>
			<button
				type="button"
				aria-label="Close cart"
				onClick={onClose}
				className={`absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:duration-0 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
			/>
			<aside
				id="customer-cart-drawer"
				role="dialog"
				aria-modal={isOpen}
				aria-labelledby="customer-cart-title"
				className={`relative flex h-full w-full max-w-[420px] flex-col border-l border-[rgba(217,192,142,0.2)] bg-[#101a19] text-[#f3efe8] shadow-2xl transition-transform duration-300 ease-out motion-reduce:duration-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
			>
				<div className="flex items-start justify-between border-b border-[rgba(217,192,142,0.14)] px-6 py-5">
					<div>
						<p className="text-[10px] uppercase tracking-[0.14em] text-[#d9c08e]">Current order</p>
						<h2 id="customer-cart-title" className="mt-1 font-serif text-2xl leading-tight">Your cart</h2>
					</div>
					<button
						type="button"
						aria-label="Close cart"
						onClick={onClose}
						className="grid size-9 place-items-center rounded-full border border-[rgba(217,192,142,0.24)] text-[#c7d1cc] transition-colors hover:bg-[rgba(217,192,142,0.1)] hover:text-[#f3efe8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e]"
					>
						<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4 stroke-current" strokeWidth="1.7" strokeLinecap="round">
							<path d="m6 6 12 12M18 6 6 18" />
						</svg>
					</button>
				</div>

				{lines.length === 0 ? (
					<div className={`flex flex-1 flex-col items-center justify-center px-8 text-center transition-[opacity,transform] delay-75 duration-300 motion-reduce:delay-0 motion-reduce:duration-0 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
						<div className="grid size-16 place-items-center rounded-full border border-[rgba(217,192,142,0.2)] bg-[rgba(217,192,142,0.07)] text-[#d9c08e]">
							<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-7 stroke-current" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
								<path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
								<circle cx="10" cy="20" r="1" />
								<circle cx="18" cy="20" r="1" />
							</svg>
						</div>
						<h3 className="mt-5 font-serif text-xl">Your cart is empty</h3>
						<p className="mt-2 max-w-[240px] text-sm leading-6 text-[#8e9993]">Add something delicious and it will show up here.</p>
					</div>
				) : (
					<>
						<div className="flex-1 overflow-y-auto px-6">
							<div className="flex items-baseline justify-between pt-5 text-[15px] font-semibold">
								<h3>New order</h3>
								<span className="text-[12px] font-normal text-[#8e9993]">
									{itemCount} {itemCount === 1 ? 'item' : 'items'}
								</span>
							</div>
							<ul className="divide-y divide-[rgba(217,192,142,0.12)]">
								{lines.map((line) => (
									<CartLineItem
										key={line.lineId}
										line={line}
										currencySymbol={currencySymbol}
										onQuantityChange={(quantity) => setQuantity(line.lineId, quantity)}
										onNoteChange={(note) => setNote(line.lineId, note)}
										onRemove={() => removeLine(line.lineId)}
									/>
								))}
							</ul>
						</div>
						<div className="flex items-center justify-between border-t border-[rgba(217,192,142,0.14)] px-6 py-5">
							<span className="text-[18px] font-semibold">Total</span>
							<span className="text-[22px] font-bold">{formatAmount(total, { symbol: currencySymbol })}</span>
						</div>
					</>
				)}
			</aside>
		</div>
	)
}
