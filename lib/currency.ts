// Currency utilities and formatting functions

export interface Currency {
  code: string
  symbol: string
  name: string
  position: "before" | "after"
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", position: "before" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", position: "before" },
  { code: "EUR", symbol: "€", name: "Euro", position: "before" },
  { code: "GBP", symbol: "£", name: "British Pound", position: "before" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", position: "before" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", position: "before" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", position: "before" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", position: "before" },
  { code: "ZAR", symbol: "R", name: "South African Rand", position: "before" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", position: "before" },
]

export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0] // USD

// Get user's selected currency from localStorage
export function getUserCurrency(): Currency {
  if (typeof window === "undefined") return DEFAULT_CURRENCY

  const stored = localStorage.getItem("smart-sales-currency")
  if (stored) {
    const parsed = JSON.parse(stored)
    return SUPPORTED_CURRENCIES.find((c) => c.code === parsed.code) || DEFAULT_CURRENCY
  }
  return DEFAULT_CURRENCY
}

// Save user's currency preference
export function setUserCurrency(currency: Currency): void {
  if (typeof window === "undefined") return
  localStorage.setItem("smart-sales-currency", JSON.stringify(currency))
}

// Format currency value with proper symbol and positioning
export function formatCurrency(amount: number, currency?: Currency): string {
  const curr = currency || getUserCurrency()
  const formatted = amount.toFixed(2)

  if (curr.position === "before") {
    return `${curr.symbol}${formatted}`
  } else {
    return `${formatted}${curr.symbol}`
  }
}

// Format currency for input labels
export function getCurrencyLabel(label: string, currency?: Currency): string {
  const curr = currency || getUserCurrency()
  return `${label} (${curr.symbol})`
}
