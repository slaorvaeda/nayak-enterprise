"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Calendar,
  BarChart3,
  PieChart,
} from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 45000, growth: 12 },
  { month: "Feb", revenue: 52000, growth: 15.5 },
  { month: "Mar", revenue: 48000, growth: -7.7 },
  { month: "Apr", revenue: 61000, growth: 27.1 },
  { month: "May", revenue: 55000, growth: -9.8 },
  { month: "Jun", revenue: 67000, growth: 21.8 },
]

const categoryData = [
  { name: "Electronics", sales: 45000, percentage: 35, growth: 12.5 },
  { name: "Clothing", sales: 32000, percentage: 25, growth: 8.2 },
  { name: "Home & Garden", sales: 28000, percentage: 22, growth: -3.1 },
  { name: "Sports", sales: 15000, percentage: 12, growth: 15.7 },
  { name: "Books", sales: 8000, percentage: 6, growth: -5.2 },
]

const customerSegments = [
  { segment: "Premium", count: 245, value: 125000, percentage: 45 },
  { segment: "Regular", count: 892, value: 89000, percentage: 32 },
  { segment: "New", count: 456, value: 34000, percentage: 23 },
]

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive business intelligence and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">$348,000</div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">2,847</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">1,593</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">8,942</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue performance with growth indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.map((item) => (
                  <div key={item.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="font-medium w-12">{item.month}</div>
                      <div className="text-2xl font-bold">${item.revenue.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={Math.abs(item.growth) * 2} className="w-24" />
                      <Badge variant={item.growth > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                        {item.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(item.growth)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Sales breakdown by product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="font-medium w-32">{category.name}</div>
                      <div className="text-lg font-semibold">${category.sales.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Progress value={category.percentage} className="w-20" />
                        <span className="text-sm text-muted-foreground w-8">{category.percentage}%</span>
                      </div>
                      <Badge
                        variant={category.growth > 0 ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {category.growth > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(category.growth)}%
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
              <CardTitle>Customer Segmentation</CardTitle>
              <CardDescription>Customer analysis by spending behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerSegments.map((segment) => (
                  <div key={segment.segment} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          segment.segment === "Premium"
                            ? "default"
                            : segment.segment === "Regular"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {segment.segment}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{segment.count} customers</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold">${segment.value.toLocaleString()}</div>
                      <div className="flex items-center gap-2">
                        <Progress value={segment.percentage} className="w-20" />
                        <span className="text-sm text-muted-foreground w-8">{segment.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
              <CardDescription>Inventory status and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-muted-foreground">In Stock</div>
                  <Progress value={85} className="mt-2" />
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">89</div>
                  <div className="text-sm text-muted-foreground">Low Stock</div>
                  <Progress value={15} className="mt-2" />
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-red-600">23</div>
                  <div className="text-sm text-muted-foreground">Out of Stock</div>
                  <Progress value={5} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
