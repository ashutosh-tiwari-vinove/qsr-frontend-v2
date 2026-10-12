type ChatBubbleProps = {
	message?: string
	/** `assistant` renders on the left with the avatar, `user` on the right. */
	role?: 'assistant' | 'user'
}

const DEFAULT_GREETING =
	"Hi! I'm your AI dining assistant. Ask for any dish in your own words, or tap a suggestion below to start."

const TEXT_CLASSES =
	'wrap-break-word whitespace-pre-wrap text-[14px] leading-6 lg:text-[16px] lg:leading-7'

export default function ChatBubble({ message = DEFAULT_GREETING, role = 'assistant' }: ChatBubbleProps) {
	if (role === 'user') {
		return (
			<div className="flex w-full animate-[bubble-in_220ms_ease-out] justify-end">
				<div
					aria-label="You"
					className="max-w-[min(42rem,85%)] rounded-2xl rounded-br-md border border-[#24513f] bg-[#0c392d] px-4 py-3 text-[#f3efe8] lg:px-5 lg:py-4"
				>
					<p className={TEXT_CLASSES}>{message}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex w-full animate-[bubble-in_220ms_ease-out] items-end gap-3">
			<div
				aria-hidden="true"
				className="grid size-8 flex-none lg:size-10 place-items-center rounded-[10px] border border-[#24513f] bg-[#0c392d]"
			>
				<span className="grid size-[22px] lg:size-[28px] lg:text-[12px] place-items-center rounded-[6px] bg-[#d9c08e] font-serif text-[10px] leading-none font-bold text-[#0c2c24]">
					RB
				</span>
			</div>
			<div
				role="note"
				aria-label="AI dining assistant"
				className="max-w-[min(42rem,calc(100%-3.5rem))] lg:px-5 lg:py-4 rounded-2xl rounded-bl-md border border-[#263831] bg-[#151c1b] px-4 py-3 text-[#e9e7e1]"
			>
				<p className={TEXT_CLASSES}>{message}</p>
			</div>
		</div>
	)
}
