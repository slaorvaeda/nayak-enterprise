"use client"

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

// Mock data
const stats = [
  {
    title: "Total Revenue",
    value: "₹12,45,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "Monthly revenue",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    description: "Orders this month",
  },
  {
    title: "Total Products",
    value: "856",
    change: "+2.1%",
    trend: "up",
    icon: Package,
    description: "Active products",
  },
  {
    title: "Active Customers",
    value: "2,456",
    change: "-1.2%",
    trend: "down",
    icon: Users,
    description: "Registered customers",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Sharma General Store",
    amount: "₹15,750",
    status: "Completed",
    date: "2024-01-15",
    items: 12,
  },
  {
    id: "ORD-002",
    customer: "Patel Retail Shop",
    amount: "₹9,200",
    status: "Processing",
    date: "2024-01-15",
    items: 8,
  },
  {
    id: "ORD-003",
    customer: "Kumar Store",
    amount: "₹22,100",
    status: "Shipped",
    date: "2024-01-14",
    items: 15,
  },
  {
    id: "ORD-004",
    customer: "Gupta Enterprises",
    amount: "₹5,400",
    status: "Cancelled",
    date: "2024-01-14",
    items: 6,
  },
]

const topProducts = [
  {
    name: "Premium Rice (25kg)",
    sales: 245,
    revenue: "₹3,06,250",
    trend: "up",
    progress: 85,
  },
  {
    name: "Cooking Oil (15L)",
    sales: 189,
    revenue: "₹3,96,900",
    trend: "up",
    progress: 92,
  },
  {
    name: "Detergent Powder (5kg)",
    sales: 156,
    revenue: "₹70,200",
    trend: "down",
    progress: 65,
  },
  {
    name: "Tea Packets (250g x 20)",
    sales: 134,
    revenue: "₹2,41,200",
    trend: "up",
    progress: 78,
  },
]

const salesData = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 67000 },
]

export default function AdminDashboard() {
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
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.items} items</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{order.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "Completed"
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                        <Progress value={product.progress} className="w-16 h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                    <div className="flex items-center text-xs">
                      {product.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={product.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {product.trend === "up" ? "↑" : "↓"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.map((data) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="w-12 text-sm font-medium">{data.month}</div>
                <div className="flex-1 mx-4">
                  <Progress value={(data.sales / 70000) * 100} className="h-3" />
                </div>
                <div className="w-20 text-sm font-medium text-right">₹{data.sales.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent hover:bg-primary/5">
              <Package className="h-6 w-6 mb-2" />
              Add Product
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent hover:bg-primary/5">
              <Users className="h-6 w-6 mb-2" />
              Add Customer
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent hover:bg-primary/5">
              <ShoppingCart className="h-6 w-6 mb-2" />
              View Orders
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent hover:bg-primary/5">
              <TrendingUp className="h-6 w-6 mb-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
