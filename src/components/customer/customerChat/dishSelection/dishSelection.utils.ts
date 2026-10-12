import type { MenuAttribute, MenuItem } from '../../../../api/api'
import type { CartLine, CartSelections } from '../../../../store/cart.store'
import { getAttributeValues, getCustomizations } from '../menuCarousel/menuCarousel.utils'

export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 99
export const MAX_NOTE_LENGTH = 200

/** One dish the customer is currently configuring, before it is added to the order. */
export type DishDraft = {
    draftId: string
    item: MenuItem
    quantity: number
    selections: CartSelections
    note: string
}

export const isMultiSelect = (attribute: MenuAttribute) => attribute.display_type === 'multi-checkbox'

export function createDraft(draftId: string, item: MenuItem): DishDraft {
    return { draftId, item, quantity: MIN_QUANTITY, selections: {}, note: '' }
}

/** Price of one unit: base price plus the extra charge of every selected option. */
export function getUnitPrice({ item, selections }: DishDraft): number {
    const extras = getCustomizations(item).reduce((sum, attribute) => {
        const chosen = selections[attribute.name] ?? []
        return (
            sum +
            getAttributeValues(attribute)
                .filter((option) => chosen.includes(option.value))
                .reduce((optionSum, option) => optionSum + (option.price_extra || 0), 0)
        )
    }, 0)
    return item.list_price + extras
}

export const getTotalPrice = (draft: DishDraft) => getUnitPrice(draft) * draft.quantity

/** Names of required option groups the customer has not chosen yet. */
export function getMissingRequired({ item, selections }: DishDraft): string[] {
    return getCustomizations(item)
        .filter((attribute) => attribute.required && (selections[attribute.name]?.length ?? 0) === 0)
        .map((attribute) => attribute.name)
}

export function toCartLine(draft: DishDraft): Omit<CartLine, 'lineId'> {
    return {
        itemId: draft.item.id,
        name: draft.item.name,
        imageUrl: draft.item.image_url,
        unitPrice: getUnitPrice(draft),
        quantity: draft.quantity,
        selections: draft.selections,
        note: draft.note.trim(),
    }
}
