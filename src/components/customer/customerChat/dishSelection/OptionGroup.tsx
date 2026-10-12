import type { MenuAttribute } from '../../../../api/api'
import Pill from '../../../ui/button/Pill'
import { getAttributeValues } from '../menuCarousel/menuCarousel.utils'
import { isMultiSelect } from './dishSelection.utils'

type OptionGroupProps = {
    attribute: MenuAttribute
    selected: string[]
    currencySymbol?: string
    onToggle: (value: string) => void
}

export default function OptionGroup({ attribute, selected, currencySymbol = '', onToggle }: OptionGroupProps) {
    const multiple = isMultiSelect(attribute)

    return (
        <div role={multiple ? 'group' : 'radiogroup'} aria-label={attribute.name} className="flex flex-col gap-2.5">
            <p className="flex items-baseline gap-2 text-[14px] font-semibold text-[#f3efe8]">
                {attribute.name}
                {attribute.required ? (
                    <span className="text-[12px] font-medium text-[#f08a73]">Required</span>
                ) : (
                    <span className="text-[12px] font-normal text-[#8e9993]">{multiple ? 'Pick any' : 'Optional'}</span>
                )}
            </p>
            <div className="flex flex-wrap gap-2">
                {getAttributeValues(attribute).map((option) => (
                    <Pill
                        key={option.value}
                        variant="suggestions"
                        label={option.price_extra > 0 ? `${option.value} +${currencySymbol}${option.price_extra}` : option.value}
                        selected={selected.includes(option.value)}
                        onClick={() => onToggle(option.value)}
                    />
                ))}
            </div>
        </div>
    )
}
