// Local storage utilities for data persistence

export interface InventoryItem {
  id: string
  name: string
  costPrice: number
  sellingPrice: number
  quantity: number
  category: string
  createdAt: string
  updatedAt: string
}

export interface SaleRecord {
  id: string
  itemId: string
  itemName: string
  quantitySold: number
  unitPrice: number
  totalAmount: number
  date: string
  createdAt: string
}

export interface DailyIncome {
  date: string
  totalSales: number
  totalProfit: number
  itemsSold: number
}

const STORAGE_KEYS = {
  INVENTORY: "smart-sales-inventory",
  SALES: "smart-sales-sales",
  DAILY_INCOME: "smart-sales-daily-income",
}

// Inventory Management
export const getInventory = (): InventoryItem[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY) || "[]")
}

export const saveInventoryItem = (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">): InventoryItem => {
  const inventory = getInventory()
  const newItem: InventoryItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  inventory.push(newItem)
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory))
  return newItem
}

export const updateInventoryItem = (id: string, updates: Partial<InventoryItem>): InventoryItem | null => {
  const inventory = getInventory()
  const index = inventory.findIndex((item) => item.id === id)

  if (index === -1) return null

  inventory[index] = {
    ...inventory[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory))
  return inventory[index]
}

export const deleteInventoryItem = (id: string): boolean => {
  const inventory = getInventory()
  const filteredInventory = inventory.filter((item) => item.id !== id)

  if (filteredInventory.length === inventory.length) return false

  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(filteredInventory))
  return true
}

// Sales Management
export const getSales = (): SaleRecord[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES) || "[]")
}

export const saveSaleRecord = (sale: Omit<SaleRecord, "id" | "createdAt">): SaleRecord => {
  const sales = getSales()
  const newSale: SaleRecord = {
    ...sale,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  sales.push(newSale)
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))

  // Update inventory quantity
  const inventory = getInventory()
  const itemIndex = inventory.findIndex((item) => item.id === sale.itemId)
  if (itemIndex !== -1) {
    inventory[itemIndex].quantity -= sale.quantitySold
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory))
  }

  return newSale
}

// Analytics
export const getDailyIncome = (): DailyIncome[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_INCOME) || "[]")
}

export const calculateDailyIncome = (date: string): DailyIncome => {
  const sales = getSales()
  const inventory = getInventory()

  const dailySales = sales.filter((sale) => sale.date === date)

  const totalSales = dailySales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const itemsSold = dailySales.reduce((sum, sale) => sum + sale.quantitySold, 0)

  // Calculate profit
  let totalProfit = 0
  dailySales.forEach((sale) => {
    const item = inventory.find((item) => item.id === sale.itemId)
    if (item) {
      const profit = (sale.unitPrice - item.costPrice) * sale.quantitySold
      totalProfit += profit
    }
  })

  return {
    date,
    totalSales,
    totalProfit,
    itemsSold,
  }
}
