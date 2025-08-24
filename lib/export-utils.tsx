// Utility functions for exporting reports

import { getInventory, getSales, calculateDailyIncome, type InventoryItem, type SaleRecord } from "./storage"

export interface ReportData {
  businessName: string
  reportDate: string
  dateRange: string
  summary: {
    totalRevenue: number
    totalProfit: number
    totalSales: number
    totalItemsSold: number
    profitMargin: number
  }
  salesData: SaleRecord[]
  inventoryData: InventoryItem[]
  dailyBreakdown: Array<{
    date: string
    sales: number
    revenue: number
    profit: number
    itemsSold: number
  }>
  productPerformance: Array<{
    name: string
    category: string
    sold: number
    revenue: number
    profit: number
    profitMargin: number
  }>
}

export function generateReportData(businessName: string, startDate: string, endDate: string): ReportData {
  const inventory = getInventory()
  const allSales = getSales()

  // Filter sales by date range
  const salesData = allSales.filter((sale) => {
    const saleDate = new Date(sale.date)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return saleDate >= start && saleDate <= end
  })

  // Calculate summary metrics
  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const totalProfit = salesData.reduce((sum, sale) => {
    const item = inventory.find((inv) => inv.id === sale.itemId)
    if (item) {
      return sum + (sale.unitPrice - item.costPrice) * sale.quantitySold
    }
    return sum
  }, 0)
  const totalItemsSold = salesData.reduce((sum, sale) => sum + sale.quantitySold, 0)
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  // Generate daily breakdown
  const dateRange = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    const daySales = salesData.filter((sale) => sale.date === dateStr)
    const dayIncome = calculateDailyIncome(dateStr)

    dateRange.push({
      date: dateStr,
      sales: daySales.length,
      revenue: daySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      profit: dayIncome.totalProfit,
      itemsSold: daySales.reduce((sum, sale) => sum + sale.quantitySold, 0),
    })
  }

  // Product performance
  const productPerformance = inventory
    .map((item) => {
      const itemSales = salesData.filter((sale) => sale.itemId === item.id)
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
        profitMargin: item.costPrice > 0 ? ((item.sellingPrice - item.costPrice) / item.costPrice) * 100 : 0,
      }
    })
    .filter((item) => item.sold > 0)
    .sort((a, b) => b.revenue - a.revenue)

  return {
    businessName,
    reportDate: new Date().toISOString().split("T")[0],
    dateRange: `${startDate} to ${endDate}`,
    summary: {
      totalRevenue,
      totalProfit,
      totalSales: salesData.length,
      totalItemsSold,
      profitMargin,
    },
    salesData,
    inventoryData: inventory,
    dailyBreakdown: dateRange,
    productPerformance,
  }
}

export function exportToCSV(data: ReportData): void {
  const csvContent = [
    // Header
    `Business Report - ${data.businessName}`,
    `Report Date: ${data.reportDate}`,
    `Date Range: ${data.dateRange}`,
    "",
    "SUMMARY",
    `Total Revenue,$${data.summary.totalRevenue.toFixed(2)}`,
    `Total Profit,$${data.summary.totalProfit.toFixed(2)}`,
    `Total Sales,${data.summary.totalSales}`,
    `Total Items Sold,${data.summary.totalItemsSold}`,
    `Profit Margin,${data.summary.profitMargin.toFixed(2)}%`,
    "",
    "DAILY BREAKDOWN",
    "Date,Sales Count,Revenue,Profit,Items Sold",
    ...data.dailyBreakdown.map(
      (day) => `${day.date},${day.sales},$${day.revenue.toFixed(2)},$${day.profit.toFixed(2)},${day.itemsSold}`,
    ),
    "",
    "PRODUCT PERFORMANCE",
    "Product,Category,Units Sold,Revenue,Profit,Profit Margin",
    ...data.productPerformance.map(
      (product) =>
        `${product.name},${product.category},${product.sold},$${product.revenue.toFixed(2)},$${product.profit.toFixed(2)},${product.profitMargin.toFixed(2)}%`,
    ),
    "",
    "SALES TRANSACTIONS",
    "Date,Product,Quantity,Unit Price,Total Amount",
    ...data.salesData.map(
      (sale) =>
        `${sale.date},${sale.itemName},${sale.quantitySold},$${sale.unitPrice.toFixed(2)},$${sale.totalAmount.toFixed(2)}`,
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `sales-report-${data.reportDate}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPDF(data: ReportData): void {
  // Create a printable HTML version
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sales Report - ${data.businessName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .header h1 { color: #3b82f6; margin: 0; }
        .header p { margin: 5px 0; color: #666; }
        .section { margin: 30px 0; }
        .section h2 { color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .summary-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
        .summary-card h3 { margin: 0 0 10px 0; color: #374151; font-size: 14px; }
        .summary-card .value { font-size: 24px; font-weight: bold; color: #3b82f6; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background-color: #f9fafb; font-weight: bold; }
        .text-right { text-align: right; }
        .text-green { color: #10b981; }
        .text-red { color: #ef4444; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.businessName}</h1>
        <p>Sales & Revenue Report</p>
        <p>Report Date: ${new Date(data.reportDate).toLocaleDateString()}</p>
        <p>Period: ${data.dateRange}</p>
      </div>

      <div class="section">
        <h2>Executive Summary</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Revenue</h3>
            <div class="value">$${data.summary.totalRevenue.toFixed(2)}</div>
          </div>
          <div class="summary-card">
            <h3>Total Profit</h3>
            <div class="value text-green">$${data.summary.totalProfit.toFixed(2)}</div>
          </div>
          <div class="summary-card">
            <h3>Total Sales</h3>
            <div class="value">${data.summary.totalSales}</div>
          </div>
          <div class="summary-card">
            <h3>Items Sold</h3>
            <div class="value">${data.summary.totalItemsSold}</div>
          </div>
          <div class="summary-card">
            <h3>Profit Margin</h3>
            <div class="value">${data.summary.profitMargin.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Top Performing Products</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th class="text-right">Units Sold</th>
              <th class="text-right">Revenue</th>
              <th class="text-right">Profit</th>
              <th class="text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            ${data.productPerformance
              .slice(0, 10)
              .map(
                (product) => `
              <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td class="text-right">${product.sold}</td>
                <td class="text-right">$${product.revenue.toFixed(2)}</td>
                <td class="text-right text-green">$${product.profit.toFixed(2)}</td>
                <td class="text-right">${product.profitMargin.toFixed(1)}%</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Daily Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th class="text-right">Sales</th>
              <th class="text-right">Revenue</th>
              <th class="text-right">Profit</th>
              <th class="text-right">Items Sold</th>
            </tr>
          </thead>
          <tbody>
            ${data.dailyBreakdown
              .filter((day) => day.sales > 0)
              .map(
                (day) => `
              <tr>
                <td>${new Date(day.date).toLocaleDateString()}</td>
                <td class="text-right">${day.sales}</td>
                <td class="text-right">$${day.revenue.toFixed(2)}</td>
                <td class="text-right text-green">$${day.profit.toFixed(2)}</td>
                <td class="text-right">${day.itemsSold}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="no-print" style="text-align: center; margin: 30px 0;">
        <button onclick="window.print()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Print Report</button>
        <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
      </div>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

export function exportToJSON(data: ReportData): void {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `sales-report-${data.reportDate}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
