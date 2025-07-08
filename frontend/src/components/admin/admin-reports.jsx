"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, TrendingUp, Users, Package, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AdminReports() {
  const { toast } = useToast()
  const [selectedReport, setSelectedReport] = useState("sales")
  const [dateRange, setDateRange] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    { value: "sales", label: "Sales Report", icon: TrendingUp },
    { value: "customers", label: "Customer Report", icon: Users },
    { value: "inventory", label: "Inventory Report", icon: Package },
    { value: "orders", label: "Orders Report", icon: ShoppingCart },
  ]

  const salesData = [
    { product: "Rice 25kg", quantity: 150, revenue: 225000, profit: 45000 },
    { product: "Wheat Flour 10kg", quantity: 200, revenue: 180000, profit: 36000 },
    { product: "Cooking Oil 5L", quantity: 80, revenue: 120000, profit: 24000 },
    { product: "Sugar 1kg", quantity: 300, revenue: 135000, profit: 27000 },
    { product: "Dal 1kg", quantity: 120, revenue: 108000, profit: 21600 },
  ]

  const customerData = [
    { name: "Sharma General Store", orders: 25, totalSpent: 125000, status: "Active" },
    { name: "Kumar Retail", orders: 18, totalSpent: 89000, status: "Active" },
    { name: "Patel Wholesale", orders: 32, totalSpent: 198000, status: "Active" },
    { name: "Singh Traders", orders: 12, totalSpent: 67000, status: "Inactive" },
    { name: "Gupta Stores", orders: 28, totalSpent: 156000, status: "Active" },
  ]

  const inventoryData = [
    { product: "Rice 25kg", currentStock: 45, minStock: 20, status: "Good" },
    { product: "Cooking Oil 5L", currentStock: 8, minStock: 15, status: "Low" },
    { product: "Wheat Flour 10kg", currentStock: 67, minStock: 25, status: "Good" },
    { product: "Sugar 1kg", currentStock: 12, minStock: 30, status: "Low" },
    { product: "Dal 1kg", currentStock: 89, minStock: 20, status: "Good" },
  ]

  const ordersData = [
    { orderId: "ORD-2024-156", customer: "Sharma Store", amount: 15600, status: "Delivered", date: "2024-01-15" },
    { orderId: "ORD-2024-155", customer: "Kumar Retail", amount: 8900, status: "Processing", date: "2024-01-15" },
    { orderId: "ORD-2024-154", customer: "Patel Wholesale", amount: 23400, status: "Shipped", date: "2024-01-14" },
    { orderId: "ORD-2024-153", customer: "Singh Traders", amount: 12300, status: "Delivered", date: "2024-01-14" },
    { orderId: "ORD-2024-152", customer: "Gupta Stores", amount: 18700, status: "Cancelled", date: "2024-01-13" },
  ]

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)

    toast({
      title: "Report Generated",
      description: `${reportTypes.find((r) => r.value === selectedReport)?.label} has been generated successfully`,
    })
  }

  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded as PDF",
    })
  }

  const renderReportData = () => {
    switch (selectedReport) {
      case "sales":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.revenue.toLocaleString()}</TableCell>
                  <TableCell>₹{item.profit.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "customers":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerData.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>₹{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "Active" ? "default" : "secondary"}>{customer.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "inventory":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Minimum Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Good" ? "default" : "destructive"}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "orders":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Processing"
                            ? "secondary"
                            : order.status === "Shipped"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate detailed business reports and insights</p>
        </div>
        <Button onClick={handleDownloadReport}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <Icon className="h-4 w-4 mr-2" />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {(() => {
              const reportType = reportTypes.find((r) => r.value === selectedReport)
              const Icon = reportType?.icon || FileText
              return (
                <>
                  <Icon className="h-5 w-5 mr-2" />
                  {reportType?.label || "Report"}
                </>
              )
            })()}
          </CardTitle>
          <CardDescription>Detailed data for the selected report type</CardDescription>
        </CardHeader>
        <CardContent>{renderReportData()}</CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹8,75,000</div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">Active Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹1,75,000</div>
            <p className="text-xs text-muted-foreground">Total Profit</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
