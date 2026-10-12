import { env } from '../../../../config/env'
import Pill from '../../../ui/button/Pill'

type WelcomeCardProps = {
    onExploreMenu?: () => void
    onSelectCategory?: (category: 'drinks' | 'vegetarian') => void
}

export default function WelcomeCard({ onExploreMenu, onSelectCategory }: WelcomeCardProps) {
    return (
        <section className="relative isolate flex min-h-[280px] w-full lg:min-h-[360px] lg:px-14 lg:py-10 items-center overflow-hidden rounded-[24px] border border-[#24513f] bg-[#0c392d] px-8 py-7 shadow-[0_18px_45px_rgba(0,0,0,0.22)] max-[520px]:min-h-[340px] max-[520px]:rounded-[20px] max-[520px]:px-5 max-[520px]:py-6">
            <div aria-hidden="true" className="absolute inset-y-0 right-0 z-0 w-[48%] max-[520px]:w-[55%] lg:w-[52%]">
                <img
                    src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&h=600&q=75"
                    alt=""
                    fetchPriority="high"
                    className="size-full object-cover object-center"
                />
            </div>
            <div aria-hidden="true" className="absolute inset-0 z-10 bg-[linear-gradient(90deg,#0c392d_0%,#0c392d_43%,rgba(12,57,45,0.94)_56%,rgba(12,57,45,0.22)_78%,rgba(12,57,45,0)_100%)]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-2 z-10 rounded-[17px] border border-[rgba(217,192,142,0.16)]" />

            <div className="relative z-20 w-full max-w-[365px] lg:max-w-[520px]">
                <div className="flex flex-wrap items-center gap-2.5">
                    <p className="text-[11px] leading-5 text-[#c7d1cc] lg:text-[14px]">Good evening</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(217,192,142,0.5)] bg-[rgba(12,44,36,0.65)] px-2.5 py-1 text-[10px] leading-none text-[#f3dfb5] lg:px-3 lg:py-1.5 lg:text-[12px]">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-[#d9c08e]" />
                        AI dining assistant
                    </span>
                </div>

                <h1 className="mt-2.5 font-serif text-[34px] leading-[1.08] text-[#f7f3eb] max-[520px]:text-[30px] lg:text-[52px]">
                    Welcome to<br />Restaurant Buddy.
                </h1>
                <p className="mt-3 max-w-[350px] text-[14px] leading-5 lg:max-w-[460px] lg:text-[17px] lg:leading-7 text-[#e1e8e3]">
                    Your table. Your taste. Order, track and pay at {env.resturantLocation} just by chatting.
                </p>

                <div className="mt-5 flex flex-wrap gap-2 lg:mt-7 lg:gap-3">
                    <Pill variant="showMenu" label="Explore the menu" onClick={onExploreMenu} />
                    <Pill variant="suggestions" label="Drinks" onClick={() => onSelectCategory?.('drinks')} />
                    <Pill variant="suggestions" label="Vegetarian" onClick={() => onSelectCategory?.('vegetarian')} />
                </div>
            </div>

            <p className="absolute bottom-3 right-3 lg:bottom-5 lg:right-5 z-20 rounded-full border border-white/15 bg-[#101a19]/80 px-2.5 py-1.5 text-[10px] leading-none text-[#f3efe8] backdrop-blur-sm lg:px-3.5 lg:py-2 lg:text-[12px] max-[520px]:max-w-[45%] max-[520px]:text-[9px]">
                Margherita Pizza, our most ordered
            </p>
        </section>
    )
}