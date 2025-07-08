"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Target,
  Calendar,
  Download,
  BarChart3,
  Award,
  Star,
} from "lucide-react"

const salesData = {
  overview: {
    totalSales: 348000,
    totalOrders: 2847,
    averageOrderValue: 122.15,
    conversionRate: 3.2,
    growth: {
      sales: 12.5,
      orders: 8.2,
      aov: 4.1,
      conversion: -0.3,
    },
  },
  monthly: [
    { month: "Jan", sales: 45000, orders: 380, target: 50000 },
    { month: "Feb", sales: 52000, orders: 425, target: 50000 },
    { month: "Mar", sales: 48000, orders: 395, target: 50000 },
    { month: "Apr", sales: 61000, orders: 510, target: 55000 },
    { month: "May", sales: 55000, orders: 465, target: 55000 },
    { month: "Jun", sales: 67000, orders: 572, target: 60000 },
  ],
  topProducts: [
    { name: "Wireless Headphones", sales: 45000, units: 450, growth: 15.2 },
    { name: "Gaming Mouse", sales: 32000, units: 640, growth: 8.7 },
    { name: "Laptop Stand", sales: 28000, units: 350, growth: -2.1 },
    { name: "USB-C Hub", sales: 24000, units: 480, growth: 22.3 },
    { name: "Bluetooth Speaker", sales: 19000, units: 190, growth: 5.8 },
  ],
  topCustomers: [
    { name: "TechCorp Solutions", email: "orders@techcorp.com", totalSpent: 25000, orders: 45 },
    { name: "Digital Dynamics", email: "purchasing@digitaldyn.com", totalSpent: 18500, orders: 32 },
    { name: "Innovation Labs", email: "procurement@innovlabs.com", totalSpent: 15200, orders: 28 },
    { name: "Future Systems", email: "buying@futuresys.com", totalSpent: 12800, orders: 24 },
    { name: "Smart Solutions", email: "orders@smartsol.com", totalSpent: 11400, orders: 19 },
  ],
}

export default function SalesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Dashboard</h1>
          <p className="text-muted-foreground">Monitor sales performance and track revenue growth</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${salesData.overview.totalSales.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />+{salesData.overview.growth.sales}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{salesData.overview.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />+{salesData.overview.growth.orders}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">${salesData.overview.averageOrderValue}</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="h-3 w-3 mr-1" />+{salesData.overview.growth.aov}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{salesData.overview.conversionRate}%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              {Math.abs(salesData.overview.growth.conversion)}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Performance</CardTitle>
              <CardDescription>Sales vs targets with order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.monthly.map((month) => {
                  const targetAchievement = (month.sales / month.target) * 100
                  const isAboveTarget = month.sales >= month.target

                  return (
                    <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="font-medium w-12">{month.month}</div>
                        <div className="text-2xl font-bold">${month.sales.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{month.orders} orders</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Target: ${month.target.toLocaleString()}</div>
                          <Progress value={Math.min(targetAchievement, 100)} className="w-32 mt-1" />
                        </div>
                        <Badge variant={isAboveTarget ? "default" : "secondary"} className="flex items-center gap-1">
                          {isAboveTarget ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {targetAchievement.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best-selling products with growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Award className="h-5 w-5 text-yellow-500" />}
                        {index === 1 && <Star className="h-5 w-5 text-gray-400" />}
                        {index === 2 && <Star className="h-5 w-5 text-orange-600" />}
                        <span className="font-medium w-4">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.units} units sold</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold">${product.sales.toLocaleString()}</div>
                      </div>
                      <Badge
                        variant={product.growth > 0 ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {product.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(product.growth)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Highest value customers by total spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.topCustomers.map((customer, index) => (
                  <div key={customer.email} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Award className="h-5 w-5 text-yellow-500" />}
                        {index === 1 && <Star className="h-5 w-5 text-gray-400" />}
                        {index === 2 && <Star className="h-5 w-5 text-orange-600" />}
                        <span className="font-medium w-4">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold">${customer.totalSpent.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{customer.orders} orders</div>
                      </div>
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
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
