export default function MenuCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="w-[200px] flex-none animate-pulse overflow-hidden rounded-2xl border border-[#263831] bg-[#151c1b] lg:w-[230px]"
        >
            <div className="aspect-[4/3] bg-[#1d2a25]" />
            <div className="space-y-3 p-3.5">
                <div className="h-4 w-3/4 rounded bg-[#1d2a25]" />
                <div className="h-3 w-1/2 rounded bg-[#1d2a25]" />
                <div className="flex items-center justify-between pt-2">
                    <div className="h-5 w-14 rounded bg-[#1d2a25]" />
                    <div className="h-9 w-20 rounded-full bg-[#1d2a25]" />
                </div>
            </div>
        </div>
    )
}
