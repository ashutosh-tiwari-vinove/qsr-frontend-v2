import { env } from '../../../config/env'
import { selectCartCount, useCartStore } from '../../../store/cart.store'

type CustomerHeaderProps = {
    cartOpen: boolean
    onCartOpen: () => void
}

export default function CustomerHeader({ cartOpen, onCartOpen }: CustomerHeaderProps) {
    const cartCount = useCartStore(selectCartCount)

    return (
        <header className="flex min-h-[68px] items-center justify-between gap-5 lg:min-h-[84px] lg:px-10 border-b border-[rgba(217,192,142,0.18)] bg-[#0c2c24] px-7 py-2.5 max-[520px]:min-h-[62px] max-[520px]:gap-2.5 max-[520px]:px-3.5 max-[520px]:py-[9px]">
            <div className="flex min-w-0 items-center gap-[11px] max-[520px]:gap-2">
                <div className="grid size-[36px] flex-none lg:size-[46px] place-items-center rounded-[10px] border border-[rgba(200,169,106,0.55)] bg-[#0c2c24]">
                    <img src="/logo/logo.svg" alt="" className="size-[34px] object-contain lg:size-[44px]" />
                </div>
                <div className="min-w-0">
                    <p className="m-0 whitespace-nowrap font-serif text-[17px] leading-[1.2] lg:text-[22px] text-[#f3efe8] max-[520px]:text-[15px]">{env.resturantName}</p>
                    <p className="mt-0.5 max-w-[190px] overflow-hidden text-ellipsis whitespace-nowrap text-[10px] leading-[1.3] text-[#c7d1cc] lg:text-[12px] max-[520px]:text-[9px]">{env.resturantLocation}</p>
                </div>
            </div>

            <div className="relative flex flex-none items-center gap-2 max-[520px]:gap-1.5">
                <div aria-label="Restaurant is online" className="inline-flex min-h-[30px] items-center justify-center gap-1.5 lg:min-h-[38px] lg:px-3.5 lg:text-[13px] rounded-full bg-[rgba(199,209,204,0.09)] px-2.5 text-[10px] whitespace-nowrap text-[#c7d1cc] max-[520px]:size-[30px] max-[520px]:p-0 max-[520px]:text-[0px]">
                    <span aria-hidden="true" className="size-[7px] rounded-full bg-[#39d49b] shadow-[0_0_0_3px_rgba(57,212,155,0.12)]" />
                    <span>Online</span>
                </div>
                <div className="inline-flex min-h-[30px] items-center justify-center gap-[5px] lg:min-h-[38px] lg:px-4 lg:text-[13px] rounded-full border border-[rgba(217,192,142,0.42)] px-[11px] text-[10px] whitespace-nowrap text-[#d9c08e] max-[520px]:min-h-[28px] max-[520px]:px-2 max-[520px]:text-[9px]">
                    Main Floor, <span className="text-[#f3dfb5]">Table 1</span>
                </div>
                <button
                    type="button"
                    aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                    aria-expanded={cartOpen}
                    aria-controls="customer-cart-drawer"
                    onClick={onCartOpen}
                    className="inline-flex min-h-[30px] items-center justify-center gap-1.5 lg:min-h-[38px] lg:px-4 lg:text-[14px] rounded-full border border-[rgba(217,192,142,0.42)] px-3 text-[10px] whitespace-nowrap text-[#f3dfb5] transition-colors hover:bg-[rgba(217,192,142,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e] max-[520px]:size-[30px] max-[520px]:min-h-0 max-[520px]:p-0"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4 stroke-current lg:size-5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
                        <circle cx="10" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                    </svg>
                    <span className="max-[520px]:sr-only">Cart</span>
                    <span className="rounded-full bg-[rgba(217,192,142,0.16)] px-1.5 py-0.5 text-[9px] lg:text-[11px] leading-none text-[#d9c08e] max-[520px]:sr-only">{cartCount}</span>
                </button>
            </div>
        </header>
    )
}