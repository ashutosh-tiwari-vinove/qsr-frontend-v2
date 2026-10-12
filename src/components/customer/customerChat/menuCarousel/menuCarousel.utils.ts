import { formatAmount } from '../../../../utils/currency'
import type { MenuAttribute, MenuAttributeValue, MenuItem } from '../../../../api/api'

export type DietType = 'veg' | 'nonVeg'

const DIET_ATTRIBUTE = 'Dietary Preference'
const NON_VEG_PATTERN = /non[\s-]?veg/i
const VEG_PATTERN = /veg/i

/** Reads the veg / non-veg marker from the item's "Dietary Preference" attribute. */
export function getDietType(item: MenuItem): DietType | null {
    const value = item.attributes?.find((attribute) => attribute.name === DIET_ATTRIBUTE)?.values?.[0]?.value
    if (!value) return null
    if (NON_VEG_PATTERN.test(value)) return 'nonVeg'
    if (VEG_PATTERN.test(value)) return 'veg'
    return null
}

/** Option values of an attribute, ignoring null, missing or blank entries. */
export function getAttributeValues(attribute: MenuAttribute): MenuAttributeValue[] {
    return (attribute.values ?? []).filter((option) => option?.value?.trim())
}

/**
 * Attributes the customer can pick from. `search_only` attributes (cuisine, meal time, ...)
 * only exist for filtering, so they are skipped, as are attributes with no usable values.
 */
export function getCustomizations(item: MenuItem): MenuAttribute[] {
    return (item.attributes ?? []).filter((attribute) => !attribute.search_only && getAttributeValues(attribute).length > 0)
}

export function hasCustomizations(item: MenuItem): boolean {
    return getCustomizations(item).length > 0
}

/** Short hint for the card subtitle, e.g. "Choose spice level". */
export function getCustomizationHint(item: MenuItem): string {
    const customizations = getCustomizations(item)
    if (customizations.length === 0) return 'Ready to add'
    const required = customizations.find((attribute) => attribute.required)
    return required ? `Choose ${required.name.toLowerCase()}` : 'Customisable'
}

/** Formats an item's price with the restaurant's currency symbol, falling back to the item's currency code. */
export function formatPrice(item: MenuItem, symbol?: string): string {
    return formatAmount(item.list_price, { symbol, code: item.currency_id.display_name })
}
