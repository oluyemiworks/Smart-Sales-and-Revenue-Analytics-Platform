"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { BarChart3, Package, TrendingUp, LogOut, Plus, DollarSign, Download } from "lucide-react"
import { InventoryManagement } from "@/components/inventory/inventory-management"
import { SalesTracking } from "@/components/sales/sales-tracking"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { ReportExport } from "@/components/reports/report-export"
import { CurrencySelector } from "@/components/currency/currency-selector"

export function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Smart Sales</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.businessName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CurrencySelector />
              <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "inventory", label: "Inventory", icon: Package },
              { id: "sales", label: "Sales", icon: DollarSign },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "reports", label: "Reports", icon: Download },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
              <p className="text-gray-600 dark:text-gray-400">Track your business performance at a glance</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0.00</div>
                  <p className="text-xs text-muted-foreground">No sales recorded yet</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Items in Stock</CardTitle>
                  <Package className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Add inventory to get started</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No sales today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0%</div>
                  <p className="text-xs text-muted-foreground">Start selling to see profit</p>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Set up your business in a few simple steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Add your first inventory item</h3>
                    <p className="text-sm text-muted-foreground">Start by adding products to your inventory</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("inventory")}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Record your first sale</h3>
                    <p className="text-sm text-muted-foreground">Track sales to see your revenue grow</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("sales")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Record Sale
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">View analytics</h3>
                    <p className="text-sm text-muted-foreground">Analyze your business performance</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("analytics")}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Export reports</h3>
                    <p className="text-sm text-muted-foreground">Generate PDF and Excel reports</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("reports")}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "inventory" && <InventoryManagement />}
        {activeTab === "sales" && <SalesTracking />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
        {activeTab === "reports" && <ReportExport />}
      </main>
    </div>
  )
}
