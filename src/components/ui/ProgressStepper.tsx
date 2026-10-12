export type ProgressStep = {
    key: string
    label: string
}

type ProgressStepperProps = {
    steps: readonly ProgressStep[]
    /** Index of the step currently in progress; earlier steps render as completed. */
    currentIndex: number
    /** Accessible name for the list. */
    label?: string
    className?: string
}

function CheckIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-3 stroke-current lg:size-3.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
    )
}

export default function ProgressStepper({ steps, currentIndex, label = 'Progress', className = '' }: ProgressStepperProps) {
    const lastIndex = steps.length - 1

    return (
        <ol aria-label={label} className={`m-0 flex w-full list-none p-0 pt-1 ${className}`}>
            {steps.map((step, index) => {
                const isComplete = index < currentIndex || (index === currentIndex && index === lastIndex)
                const isCurrent = index === currentIndex && !isComplete

                const dot = isComplete
                    ? 'border-[#39d49b] bg-[#39d49b] text-[#0c2c24]'
                    : isCurrent
                      ? 'border-[#f16b4e] bg-[#f16b4e] text-[#1b211e] shadow-[0_0_0_4px_rgba(241,107,78,0.2)]'
                      : 'border-[#2a3a34] bg-[#161f1c] text-[#8e9993]'

                return (
                    <li
                        key={step.key}
                        aria-current={isCurrent ? 'step' : undefined}
                        className="relative flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center"
                    >
                        {index > 0 && (
                            <span
                                aria-hidden="true"
                                className={`absolute top-3 right-1/2 h-0.5 w-full -translate-y-1/2 lg:top-3.5 ${index <= currentIndex ? 'bg-[#39d49b]' : 'bg-[#2a3a34]'}`}
                            />
                        )}
                        <span className={`relative z-10 grid size-6 place-items-center rounded-full border-2 text-[10px] font-semibold transition-colors duration-200 lg:size-7 lg:text-[11px] ${dot}`}>
                            {isComplete ? <CheckIcon /> : index + 1}
                        </span>
                        <span className={`max-w-full text-[10px] leading-tight lg:text-[12px] ${isCurrent ? 'font-semibold text-[#f3dfb5]' : isComplete ? 'text-[#f3efe8]' : 'text-[#8e9993]'}`}>
                            {step.label}
                        </span>
                    </li>
                )
            })}
        </ol>
    )
}
