"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, ShoppingCart, TrendingUp, Calendar, DollarSign } from "lucide-react"
import {
  getInventory,
  getSales,
  saveSaleRecord,
  calculateDailyIncome,
  type InventoryItem,
  type SaleRecord,
} from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export function SalesTracking() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [isAddSaleDialogOpen, setIsAddSaleDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const { toast } = useToast()

  useEffect(() => {
    setInventory(getInventory())
    setSales(getSales())
  }, [])

  const handleAddSale = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const itemId = formData.get("itemId") as string
    const quantitySold = Number.parseInt(formData.get("quantitySold") as string)
    const saleDate = formData.get("date") as string

    const selectedItem = inventory.find((item) => item.id === itemId)
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "Selected item not found.",
        variant: "destructive",
      })
      return
    }

    if (quantitySold > selectedItem.quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${selectedItem.quantity} units available for ${selectedItem.name}.`,
        variant: "destructive",
      })
      return
    }

    const newSale = {
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      quantitySold,
      unitPrice: selectedItem.sellingPrice,
      totalAmount: selectedItem.sellingPrice * quantitySold,
      date: saleDate,
    }

    saveSaleRecord(newSale)
    setInventory(getInventory()) // Refresh to show updated quantities
    setSales(getSales())
    setIsAddSaleDialogOpen(false)

    toast({
      title: "Sale Recorded",
      description: `Sold ${quantitySold} units of ${selectedItem.name} for $${newSale.totalAmount.toFixed(2)}.`,
    })
  }

  const todaysSales = sales.filter((sale) => sale.date === new Date().toISOString().split("T")[0])
  const selectedDateSales = sales.filter((sale) => sale.date === selectedDate)
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const selectedDateRevenue = selectedDateSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

  // Calculate profit for selected date
  const selectedDateIncome = calculateDailyIncome(selectedDate)

  const availableItems = inventory.filter((item) => item.quantity > 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Tracking</h2>
          <p className="text-gray-600 dark:text-gray-400">Record and monitor your daily sales</p>
        </div>
        <Dialog open={isAddSaleDialogOpen} onOpenChange={setIsAddSaleDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={availableItems.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Record Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
              <DialogDescription>Add a new sale transaction</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemId">Product</Label>
                <Select name="itemId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - ${item.sellingPrice.toFixed(2)} ({item.quantity} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantitySold">Quantity Sold</Label>
                <Input id="quantitySold" name="quantitySold" type="number" min="1" placeholder="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Sale Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddSaleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Sale</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {availableItems.length === 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200">No Items Available</CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Add items to your inventory before recording sales
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysSales.length}</div>
            <p className="text-xs text-muted-foreground">Transactions today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todaysRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Revenue today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-muted-foreground">All time transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Sales Report
          </CardTitle>
          <CardDescription>View sales for a specific date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="dateFilter">Select Date:</Label>
              <Input
                id="dateFilter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium">Sales:</span>
                <Badge variant="secondary">{selectedDateSales.length}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Revenue:</span>
                <Badge variant="secondary">${selectedDateRevenue.toFixed(2)}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Profit:</span>
                <Badge
                  variant="secondary"
                  className="text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900"
                >
                  ${selectedDateIncome.totalProfit.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>

          {selectedDateSales.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sales on this date</h3>
              <p className="text-gray-600 dark:text-gray-400">Select a different date or record a new sale</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDateSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{new Date(sale.createdAt).toLocaleTimeString()}</TableCell>
                      <TableCell>{sale.itemName}</TableCell>
                      <TableCell>{sale.quantitySold}</TableCell>
                      <TableCell>${sale.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">${sale.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Latest sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sales recorded</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Start by recording your first sale</p>
              {availableItems.length > 0 && (
                <Button onClick={() => setIsAddSaleDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record First Sale
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10)
                    .map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell>{sale.itemName}</TableCell>
                        <TableCell>{sale.quantitySold}</TableCell>
                        <TableCell>${sale.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${sale.totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
