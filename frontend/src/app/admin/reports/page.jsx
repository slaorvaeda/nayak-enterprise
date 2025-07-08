"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, Calendar, Clock, CheckCircle, AlertCircle, Play, Settings, Filter } from "lucide-react"

const reportTypes = [
  { id: "sales", name: "Sales Report", description: "Comprehensive sales analysis" },
  { id: "inventory", name: "Inventory Report", description: "Stock levels and movements" },
  { id: "customers", name: "Customer Report", description: "Customer behavior and analytics" },
  { id: "orders", name: "Order Report", description: "Order processing and fulfillment" },
  { id: "financial", name: "Financial Report", description: "Revenue and profit analysis" },
]

const recentReports = [
  {
    id: 1,
    name: "Monthly Sales Report - December 2024",
    type: "Sales",
    status: "completed",
    createdAt: "2024-01-02",
    size: "2.4 MB",
    format: "PDF",
  },
  {
    id: 2,
    name: "Inventory Status Report",
    type: "Inventory",
    status: "processing",
    createdAt: "2024-01-02",
    progress: 65,
    format: "Excel",
  },
  {
    id: 3,
    name: "Customer Analytics Q4 2024",
    type: "Customer",
    status: "completed",
    createdAt: "2024-01-01",
    size: "1.8 MB",
    format: "PDF",
  },
  {
    id: 4,
    name: "Order Fulfillment Report",
    type: "Orders",
    status: "failed",
    createdAt: "2024-01-01",
    error: "Data source unavailable",
    format: "CSV",
  },
]

const scheduledReports = [
  {
    id: 1,
    name: "Weekly Sales Summary",
    type: "Sales",
    schedule: "Every Monday at 9:00 AM",
    nextRun: "2024-01-08",
    status: "active",
  },
  {
    id: 2,
    name: "Monthly Inventory Report",
    type: "Inventory",
    schedule: "1st of every month at 8:00 AM",
    nextRun: "2024-02-01",
    status: "active",
  },
  {
    id: 3,
    name: "Quarterly Financial Report",
    type: "Financial",
    schedule: "Every quarter end",
    nextRun: "2024-03-31",
    status: "paused",
  },
]

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [format, setFormat] = useState("")

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Processing
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "paused":
        return <Badge variant="secondary">Paused</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports Management</h1>
          <p className="text-muted-foreground">Generate, schedule, and manage business reports</p>
        </div>
        <Button>
          <Play className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Configuration */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                  <CardDescription>Configure your report parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7-days">Last 7 days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 days</SelectItem>
                        <SelectItem value="last-quarter">Last quarter</SelectItem>
                        <SelectItem value="last-year">Last year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="format">Export Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Report Types */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Available Report Types</CardTitle>
                  <CardDescription>Choose from our comprehensive report templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 ${
                          selectedReportType === type.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                        }`}
                        onClick={() => setSelectedReportType(type.id)}
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium">{type.name}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>View and download previously generated reports</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(report.status)}
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{report.createdAt}</span>
                          <span>•</span>
                          <span>{report.format}</span>
                          {report.size && (
                            <>
                              <span>•</span>
                              <span>{report.size}</span>
                            </>
                          )}
                        </div>
                        {report.status === "processing" && report.progress && (
                          <div className="mt-2">
                            <Progress value={report.progress} className="w-48" />
                            <span className="text-xs text-muted-foreground">{report.progress}% complete</span>
                          </div>
                        )}
                        {report.error && <p className="text-sm text-red-600 mt-1">{report.error}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      {report.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Manage automated report generation</CardDescription>
                </div>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{report.schedule}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Next run: {report.nextRun}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
