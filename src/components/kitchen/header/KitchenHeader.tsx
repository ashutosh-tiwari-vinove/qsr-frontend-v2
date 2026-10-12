import { env } from '../../../config/env'

export default function KitchenHeader() {
    return (
        <header className="flex min-h-[68px] items-center justify-between gap-5 border-b border-[rgba(217,192,142,0.18)] bg-[#0c2c24] px-7 py-2.5 max-[520px]:min-h-[62px] max-[520px]:px-3.5 lg:min-h-[84px] lg:px-10">
            <div className="flex min-w-0 items-center gap-[11px] max-[520px]:gap-2">
                <div className="grid size-[36px] flex-none place-items-center rounded-[10px] border border-[rgba(200,169,106,0.55)] bg-[#0c2c24] lg:size-[46px]">
                    <img src="/logo/logo.svg" alt="" className="size-[34px] object-contain lg:size-[44px]" />
                </div>
                <div className="min-w-0">
                    <p className="m-0 whitespace-nowrap font-serif text-[17px] leading-[1.2] text-[#f3efe8] max-[520px]:text-[15px] lg:text-[22px]">{env.resturantName}</p>
                    <p className="mt-0.5 text-[10px] leading-[1.3] text-[#c7d1cc] lg:text-[12px]">Kitchen Display</p>
                </div>
            </div>
            <div aria-label="Kitchen is online" className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full bg-[rgba(199,209,204,0.09)] px-2.5 text-[10px] whitespace-nowrap text-[#c7d1cc] lg:min-h-[38px] lg:px-3.5 lg:text-[13px]">
                <span aria-hidden="true" className="size-[7px] rounded-full bg-[#39d49b] shadow-[0_0_0_3px_rgba(57,212,155,0.12)]" />
                Online
            </div>
        </header>
    )
}
