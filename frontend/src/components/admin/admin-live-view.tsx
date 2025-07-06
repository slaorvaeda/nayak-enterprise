"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Users, ShoppingCart, Package, TrendingUp, AlertCircle } from "lucide-react"

export function AdminLiveView() {
  const [liveData, setLiveData] = useState({
    activeUsers: 24,
    ongoingOrders: 8,
    lowStockItems: 3,
    todayRevenue: 45600,
    recentActivities: [
      { id: 1, type: "order", message: "New order #ORD-2024-157 from Sharma Store", time: "2 min ago", status: "new" },
      {
        id: 2,
        type: "stock",
        message: "Rice 25kg stock updated - 45 units added",
        time: "5 min ago",
        status: "updated",
      },
      { id: 3, type: "customer", message: "Kumar Retail registered as new customer", time: "8 min ago", status: "new" },
      {
        id: 4,
        type: "payment",
        message: "Payment received for Order #ORD-2024-156",
        time: "12 min ago",
        status: "completed",
      },
      {
        id: 5,
        type: "alert",
        message: "Cooking Oil 5L running low - 8 units remaining",
        time: "15 min ago",
        status: "warning",
      },
    ],
    systemStatus: {
      database: "online",
      paymentGateway: "online",
      inventory: "online",
      notifications: "online",
    },
  })

  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLiveData((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        ongoingOrders: Math.max(0, prev.ongoingOrders + Math.floor(Math.random() * 3) - 1),
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 1000),
        recentActivities: [
          {
            id: Date.now(),
            type: ["order", "stock", "customer", "payment"][Math.floor(Math.random() * 4)],
            message: [
              "New order received from retail customer",
              "Inventory updated for multiple items",
              "Customer inquiry about bulk pricing",
              "Payment processed successfully",
            ][Math.floor(Math.random() * 4)],
            time: "Just now",
            status: ["new", "updated", "completed"][Math.floor(Math.random() * 3)],
          },
          ...prev.recentActivities.slice(0, 4),
        ],
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "stock":
        return <Package className="h-4 w-4" />
      case "customer":
        return <Users className="h-4 w-4" />
      case "payment":
        return <TrendingUp className="h-4 w-4" />
      case "alert":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "updated":
        return "bg-green-500"
      case "completed":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live View Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring of business operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-sm">{isLive ? "Live" : "Paused"}</span>
          <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)}>
            {isLive ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{liveData.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ongoing Orders</p>
                <p className="text-2xl font-bold">{liveData.ongoingOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
                <p className="text-2xl font-bold">{liveData.lowStockItems}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold">₹{liveData.todayRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Live Activity Feed</CardTitle>
            <CardDescription>Real-time business activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status)}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getActivityIcon(activity.type)}
                      <p className="text-sm font-medium">{activity.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current status of all system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(liveData.systemStatus).map(([system, status]) => (
                <div key={system} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{system.replace(/([A-Z])/g, " $1")}</span>
                  <Badge variant={status === "online" ? "default" : "destructive"}>{status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
