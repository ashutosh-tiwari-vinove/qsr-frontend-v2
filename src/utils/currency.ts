/** Formats an amount with the restaurant's currency symbol (or code), e.g. "₹350" or "INR 350". */
export function formatAmount(amount: number, currency?: { symbol?: string; code?: string }): string {
    const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(amount)
    if (currency?.symbol) return `${currency.symbol}${formatted}`
    return currency?.code ? `${currency.code} ${formatted}` : formatted
}
