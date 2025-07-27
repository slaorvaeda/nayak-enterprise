"use client"

import { useEffect, useState } from "react"
import axios from "@/utils/axios"

import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Eye,
  BarChart3,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get("/admin/dashboard")
        setDashboard(res.data)
      } catch (err) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading dashboard...</div>
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }
  if (!dashboard) {
    return null
  }

  // Extract data
  const stats = [
    {
      title: "Total Revenue",
      value: `₹${dashboard.data.overview?.totalRevenue?.toLocaleString() ?? "0"}`,
      change: "+0%",
      trend: "up",
      icon: DollarSign,
      description: "All-time revenue",
    },
    {
      title: "Total Orders",
      value: dashboard.data.overview?.totalOrders?.toLocaleString() ?? "0",
      change: "+0%",
      trend: "up",
      icon: ShoppingCart,
      description: "All-time orders",
    },
    {
      title: "Total Products",
      value: dashboard.data.overview?.totalProducts?.toLocaleString() ?? "0",
      change: "+0%",
      trend: "up",
      icon: Package,
      description: "Active products",
    },
    {
      title: "Active Customers",
      value: dashboard.data.overview?.totalUsers?.toLocaleString() ?? "0",
      change: "+0%",
      trend: "up",
      icon: Users,
      description: "Registered customers",
    },
  ]

  const recentOrders = dashboard.data.recentOrders || []
  const monthlyRevenue = dashboard.data.monthlyRevenue || []

  // Prepare sales data for chart
  const salesData = monthlyRevenue.map((item) => ({
    month: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div> 
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            Live View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.orderNumber || order._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.orderNumber || order._id}</p>
                        <p className="text-xs text-muted-foreground">{order.items?.length ?? 0} items</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer?.businessName}</p>
                        <p className="text-xs text-muted-foreground">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₹{(order.total ?? 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "processing"
                              ? "secondary"
                              : order.status === "shipped"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Sales Analyzer (Monthly Revenue Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Analyzer</CardTitle>
            <CardDescription>Monthly revenue for the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {salesData.length === 0 && <div className="text-muted-foreground">No sales data available.</div>}
              {salesData.map((data) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="w-20 text-sm font-medium">{data.month}</div>
                  <div className="flex-1 mx-4">
                    <Progress value={Math.min((data.revenue / Math.max(...salesData.map(d => d.revenue), 1)) * 100, 100)} className="h-3" />
                  </div>
                  <div className="w-24 text-sm font-medium text-right">₹{data.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
