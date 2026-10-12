export default function TypingIndicator() {
    return (
        <div role="status" aria-label="Assistant is typing" className="flex w-full items-center gap-1 pl-11 lg:pl-13">
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    style={{ animationDelay: `${delay}ms` }}
                    className="size-2 animate-bounce rounded-full bg-[#8e9993] motion-reduce:animate-none"
                />
            ))}
        </div>
    )
}
