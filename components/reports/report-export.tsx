"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, FileSpreadsheet, FileJson, Calendar, TrendingUp } from "lucide-react"
import { generateReportData, exportToCSV, exportToPDF, exportToJSON } from "@/lib/export-utils"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export function ReportExport() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")
  const [dateRange, setDateRange] = useState("7days")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  const getDateRange = () => {
    const now = new Date()
    let startDate: string
    let endDate = now.toISOString().split("T")[0]

    if (dateRange === "custom") {
      startDate = customStartDate
      endDate = customEndDate
    } else {
      const daysBack = dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90
      const start = new Date(now)
      start.setDate(start.getDate() - daysBack)
      startDate = start.toISOString().split("T")[0]
    }

    return { startDate, endDate }
  }

  const handleExport = () => {
    const { startDate, endDate } = getDateRange()

    if (dateRange === "custom" && (!customStartDate || !customEndDate)) {
      toast({
        title: "Invalid Date Range",
        description: "Please select both start and end dates for custom range.",
        variant: "destructive",
      })
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Invalid Date Range",
        description: "Start date must be before end date.",
        variant: "destructive",
      })
      return
    }

    const reportData = generateReportData(user?.businessName || "Business", startDate, endDate)

    try {
      switch (exportFormat) {
        case "pdf":
          exportToPDF(reportData)
          break
        case "csv":
          exportToCSV(reportData)
          break
        case "json":
          exportToJSON(reportData)
          break
      }

      toast({
        title: "Report Exported",
        description: `Your ${exportFormat.toUpperCase()} report has been generated successfully.`,
      })

      setIsExportDialogOpen(false)
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const quickExports = [
    {
      title: "Today's Report",
      description: "Export today's sales and performance",
      period: "today",
      icon: Calendar,
    },
    {
      title: "Weekly Report",
      description: "Last 7 days performance summary",
      period: "7days",
      icon: TrendingUp,
    },
    {
      title: "Monthly Report",
      description: "Last 30 days comprehensive report",
      period: "30days",
      icon: FileText,
    },
  ]

  const quickExport = (period: string, format: string) => {
    const now = new Date()
    let startDate: string
    const endDate = now.toISOString().split("T")[0]

    if (period === "today") {
      startDate = endDate
    } else {
      const daysBack = period === "7days" ? 7 : 30
      const start = new Date(now)
      start.setDate(start.getDate() - daysBack)
      startDate = start.toISOString().split("T")[0]
    }

    const reportData = generateReportData(user?.businessName || "Business", startDate, endDate)

    try {
      switch (format) {
        case "pdf":
          exportToPDF(reportData)
          break
        case "csv":
          exportToCSV(reportData)
          break
      }

      toast({
        title: "Report Exported",
        description: `Your ${format.toUpperCase()} report has been generated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Report Export</h2>
          <p className="text-gray-600 dark:text-gray-400">Generate and download business reports</p>
        </div>
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Custom Export
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Custom Report</DialogTitle>
              <DialogDescription>Configure your report settings and export format</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickExports.map((option) => (
          <Card key={option.period}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <option.icon className="h-5 w-5 text-blue-600" />
                {option.title}
              </CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickExport(option.period, "pdf")}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickExport(option.period, "csv")}
                  className="flex-1"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Formats Info */}
      <Card>
        <CardHeader>
          <CardTitle>Export Formats</CardTitle>
          <CardDescription>Choose the best format for your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-medium">PDF Report</h3>
                <p className="text-sm text-muted-foreground">
                  Professional formatted report with charts and summaries. Perfect for presentations and sharing.
                </p>
                <Badge variant="secondary" className="mt-2">
                  Recommended
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium">CSV Spreadsheet</h3>
                <p className="text-sm text-muted-foreground">
                  Raw data in spreadsheet format. Great for further analysis in Excel or Google Sheets.
                </p>
                <Badge variant="outline" className="mt-2">
                  Data Analysis
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileJson className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium">JSON Data</h3>
                <p className="text-sm text-muted-foreground">
                  Structured data format. Ideal for developers and system integrations.
                </p>
                <Badge variant="outline" className="mt-2">
                  Technical
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Contents */}
      <Card>
        <CardHeader>
          <CardTitle>What's Included in Reports</CardTitle>
          <CardDescription>All reports contain comprehensive business insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Financial Summary</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Total revenue and profit</li>
                <li>• Profit margins and growth</li>
                <li>• Sales transaction count</li>
                <li>• Average order value</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Product Performance</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Top performing products</li>
                <li>• Category breakdown</li>
                <li>• Units sold by product</li>
                <li>• Individual profit margins</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Daily Analytics</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Day-by-day performance</li>
                <li>• Sales trends over time</li>
                <li>• Revenue patterns</li>
                <li>• Peak sales periods</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Transaction Details</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Complete sales history</li>
                <li>• Individual transaction records</li>
                <li>• Product quantities sold</li>
                <li>• Pricing information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
