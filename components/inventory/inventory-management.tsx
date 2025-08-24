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
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react"
import {
  getInventory,
  saveInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  type InventoryItem,
} from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setInventory(getInventory())
  }, [])

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newItem = {
      name: formData.get("name") as string,
      costPrice: Number.parseFloat(formData.get("costPrice") as string),
      sellingPrice: Number.parseFloat(formData.get("sellingPrice") as string),
      quantity: Number.parseInt(formData.get("quantity") as string),
      category: formData.get("category") as string,
    }

    const savedItem = saveInventoryItem(newItem)
    setInventory(getInventory())
    setIsAddDialogOpen(false)

    toast({
      title: "Item Added",
      description: `${savedItem.name} has been added to inventory.`,
    })
  }

  const handleEditItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingItem) return

    const formData = new FormData(e.currentTarget)

    const updates = {
      name: formData.get("name") as string,
      costPrice: Number.parseFloat(formData.get("costPrice") as string),
      sellingPrice: Number.parseFloat(formData.get("sellingPrice") as string),
      quantity: Number.parseInt(formData.get("quantity") as string),
      category: formData.get("category") as string,
    }

    updateInventoryItem(editingItem.id, updates)
    setInventory(getInventory())
    setIsEditDialogOpen(false)
    setEditingItem(null)

    toast({
      title: "Item Updated",
      description: `${updates.name} has been updated.`,
    })
  }

  const handleDeleteItem = (item: InventoryItem) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteInventoryItem(item.id)
      setInventory(getInventory())

      toast({
        title: "Item Deleted",
        description: `${item.name} has been removed from inventory.`,
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const calculateProfitMargin = (costPrice: number, sellingPrice: number) => {
    if (costPrice === 0) return 0
    return ((sellingPrice - costPrice) / costPrice) * 100
  }

  const lowStockItems = inventory.filter((item) => item.quantity <= 5)
  const totalValue = inventory.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your products and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>Add a new product to your inventory</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="Enter product name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price ($)</Label>
                  <Input id="costPrice" name="costPrice" type="number" step="0.01" placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                  <Input id="sellingPrice" name="sellingPrice" type="number" step="0.01" placeholder="0.00" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">At selling price</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items with ≤5 units</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              The following items are running low on stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <Badge
                  key={item.id}
                  variant="outline"
                  className="border-orange-300 text-orange-800 dark:border-orange-700 dark:text-orange-200"
                >
                  {item.name} ({item.quantity} left)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>All products in your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items in inventory</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first product</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Profit Margin</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                      <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={item.quantity <= 5 ? "text-orange-600 font-medium" : ""}>{item.quantity}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            calculateProfitMargin(item.costPrice, item.sellingPrice) > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {calculateProfitMargin(item.costPrice, item.sellingPrice).toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>${(item.sellingPrice * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleEditItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input id="edit-name" name="name" defaultValue={editingItem.name} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-costPrice">Cost Price ($)</Label>
                  <Input
                    id="edit-costPrice"
                    name="costPrice"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem.costPrice}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sellingPrice">Selling Price ($)</Label>
                  <Input
                    id="edit-sellingPrice"
                    name="sellingPrice"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem.sellingPrice}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    name="quantity"
                    type="number"
                    defaultValue={editingItem.quantity}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select name="category" defaultValue={editingItem.category} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Item</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
