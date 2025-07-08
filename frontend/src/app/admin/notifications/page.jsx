"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  Search,
  Filter,
  Settings,
  Trash2,
  Clock,
  Package,
  ShoppingCart,
  Users,
  Shield,
} from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "order",
    priority: "high",
    title: "New Order Received",
    message: "Order #12345 has been placed by John Smith for $245.99",
    timestamp: "2024-01-02T10:30:00Z",
    read: false,
    icon: ShoppingCart,
  },
  {
    id: 2,
    type: "inventory",
    priority: "medium",
    title: "Low Stock Alert",
    message: "Product 'Wireless Headphones' is running low (5 units remaining)",
    timestamp: "2024-01-02T09:15:00Z",
    read: false,
    icon: Package,
  },
  {
    id: 3,
    type: "customer",
    priority: "low",
    title: "New Customer Registration",
    message: "Sarah Johnson has created a new account",
    timestamp: "2024-01-02T08:45:00Z",
    read: true,
    icon: Users,
  },
  {
    id: 4,
    type: "system",
    priority: "high",
    title: "Security Alert",
    message: "Multiple failed login attempts detected from IP 192.168.1.100",
    timestamp: "2024-01-01T23:30:00Z",
    read: false,
    icon: Shield,
  },
  {
    id: 5,
    type: "order",
    priority: "medium",
    title: "Order Cancelled",
    message: "Order #12340 has been cancelled by customer",
    timestamp: "2024-01-01T16:20:00Z",
    read: true,
    icon: ShoppingCart,
  },
  {
    id: 6,
    type: "inventory",
    priority: "high",
    title: "Out of Stock",
    message: "Product 'Gaming Mouse' is now out of stock",
    timestamp: "2024-01-01T14:10:00Z",
    read: false,
    icon: Package,
  },
]

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNotifications, setSelectedNotifications] = useState([])

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "low":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        )
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-green-600" />
      case "inventory":
        return <Package className="h-5 w-5 text-blue-600" />
      case "customer":
        return <Users className="h-5 w-5 text-purple-600" />
      case "system":
        return <Shield className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read) ||
      notification.type === filter

    const matchesSearch =
      searchTerm === "" ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated with real-time alerts and system notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
            <SelectItem value="order">Orders</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No notifications found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${!notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getTypeIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(notification.priority)}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {notifications.filter((n) => n.type === "order").length}
            </div>
            <div className="text-sm text-muted-foreground">Order Notifications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter((n) => n.type === "inventory").length}
            </div>
            <div className="text-sm text-muted-foreground">Inventory Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {notifications.filter((n) => n.type === "customer").length}
            </div>
            <div className="text-sm text-muted-foreground">Customer Updates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter((n) => n.type === "system").length}
            </div>
            <div className="text-sm text-muted-foreground">System Alerts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
