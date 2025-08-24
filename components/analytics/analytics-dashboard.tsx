"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Target, BarChart3 } from "lucide-react"
import { getInventory, getSales, calculateDailyIncome, type InventoryItem, type SaleRecord } from "@/lib/storage"

export function AnalyticsDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [timeRange, setTimeRange] = useState("7days")

  useEffect(() => {
    setInventory(getInventory())
    setSales(getSales())
  }, [])

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date()
    const daysToShow = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90

    // Generate date range
    const dateRange = Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (daysToShow - 1 - i))
      return date.toISOString().split("T")[0]
    })

    // Daily sales data
    const dailySalesData = dateRange.map((date) => {
      const daySales = sales.filter((sale) => sale.date === date)
      const dayIncome = calculateDailyIncome(date)

      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date,
        sales: daySales.length,
        revenue: daySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        profit: dayIncome.totalProfit,
        itemsSold: daySales.reduce((sum, sale) => sum + sale.quantitySold, 0),
      }
    })

    // Product performance
    const productPerformance = inventory
      .map((item) => {
        const itemSales = sales.filter((sale) => sale.itemId === item.id)
        const totalSold = itemSales.reduce((sum, sale) => sum + sale.quantitySold, 0)
        const totalRevenue = itemSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
        const totalProfit = itemSales.reduce((sum, sale) => {
          return sum + (sale.unitPrice - item.costPrice) * sale.quantitySold
        }, 0)

        return {
          name: item.name,
          category: item.category,
          sold: totalSold,
          revenue: totalRevenue,
          profit: totalProfit,
          stock: item.quantity,
          profitMargin: item.costPrice > 0 ? ((item.sellingPrice - item.costPrice) / item.costPrice) * 100 : 0,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)

    // Category breakdown
    const categoryData = inventory.reduce(
      (acc, item) => {
        const itemSales = sales.filter((sale) => sale.itemId === item.id)
        const categoryRevenue = itemSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

        if (!acc[item.category]) {
          acc[item.category] = { name: item.category, value: 0, items: 0 }
        }
        acc[item.category].value += categoryRevenue
        acc[item.category].items += 1
        return acc
      },
      {} as Record<string, { name: string; value: number; items: number }>,
    )

    const categoryChartData = Object.values(categoryData).filter((cat) => cat.value > 0)

    // Summary metrics
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const totalProfit = sales.reduce((sum, sale) => {
      const item = inventory.find((inv) => inv.id === sale.itemId)
      if (item) {
        return sum + (sale.unitPrice - item.costPrice) * sale.quantitySold
      }
      return sum
    }, 0)
    const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantitySold, 0)
    const averageOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0

    // Recent period comparison
    const recentPeriodDays = Math.min(daysToShow / 2, 7)
    const recentPeriodStart = new Date(now)
    recentPeriodStart.setDate(recentPeriodStart.getDate() - recentPeriodDays)

    const previousPeriodStart = new Date(recentPeriodStart)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - recentPeriodDays)

    const recentSales = sales.filter((sale) => new Date(sale.date) >= recentPeriodStart)
    const previousSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date)
      return saleDate >= previousPeriodStart && saleDate < recentPeriodStart
    })

    const recentRevenue = recentSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const previousRevenue = previousSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0

    return {
      dailySalesData,
      productPerformance,
      categoryChartData,
      totalRevenue,
      totalProfit,
      totalItemsSold,
      averageOrderValue,
      revenueGrowth,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    }
  }, [inventory, sales, timeRange])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive business performance insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 Days</SelectItem>
            <SelectItem value="30days">30 Days</SelectItem>
            <SelectItem value="90days">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sales.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              No Data Available
            </CardTitle>
            <CardDescription>Start recording sales to see analytics</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              Add inventory items and record sales to generate meaningful analytics and insights.
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analyticsData.totalRevenue.toFixed(2)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {analyticsData.revenueGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={analyticsData.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                    {Math.abs(analyticsData.revenueGrowth).toFixed(1)}%
                  </span>
                  <span className="ml-1">vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${analyticsData.totalProfit.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{analyticsData.profitMargin.toFixed(1)}% profit margin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalItemsSold}</div>
                <p className="text-xs text-muted-foreground">{sales.length} total transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analyticsData.averageOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Per transaction average</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Profit Trend</CardTitle>
                <CardDescription>Daily revenue and profit over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `$${value.toFixed(2)}`,
                        name === "revenue" ? "Revenue" : "Profit",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales Volume */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Volume</CardTitle>
                <CardDescription>Daily sales transactions and items sold</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" name="Transactions" />
                    <Bar dataKey="itemsSold" fill="#10b981" name="Items Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Sales distribution across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.categoryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No category data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best selling products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.productPerformance.slice(0, 5).map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{product.sold} sold</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${product.revenue.toFixed(2)}</p>
                        <p className="text-xs text-green-600">${product.profit.toFixed(2)} profit</p>
                      </div>
                    </div>
                  ))}
                  {analyticsData.productPerformance.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No product sales data available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Product Performance</CardTitle>
              <CardDescription>Complete breakdown of all products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Product</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-right p-2">Units Sold</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Profit</th>
                      <th className="text-right p-2">Margin</th>
                      <th className="text-right p-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.productPerformance.map((product) => (
                      <tr key={product.name} className="border-b">
                        <td className="p-2 font-medium">{product.name}</td>
                        <td className="p-2">
                          <Badge variant="outline">{product.category}</Badge>
                        </td>
                        <td className="p-2 text-right">{product.sold}</td>
                        <td className="p-2 text-right">${product.revenue.toFixed(2)}</td>
                        <td className="p-2 text-right text-green-600">${product.profit.toFixed(2)}</td>
                        <td className="p-2 text-right">
                          <span className={product.profitMargin > 0 ? "text-green-600" : "text-red-600"}>
                            {product.profitMargin.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          <span className={product.stock <= 5 ? "text-orange-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
