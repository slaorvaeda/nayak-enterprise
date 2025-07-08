"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Info, Package, ShoppingCart, Users, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Low Stock Alert",
    message: "Cooking Oil 5L is running low (8 units remaining)",
    time: "2 minutes ago",
    read: false,
    category: "inventory",
  },
  {
    id: 2,
    type: "success",
    title: "Order Completed",
    message: "Order #ORD-2024-156 has been delivered to Sharma Store",
    time: "15 minutes ago",
    read: false,
    category: "orders",
  },
  {
    id: 3,
    type: "info",
    title: "New Customer Registration",
    message: "Patel Retail has registered as a new wholesale customer",
    time: "1 hour ago",
    read: true,
    category: "customers",
  },
  {
    id: 4,
    type: "error",
    title: "Payment Failed",
    message: "Payment for Order #ORD-2024-155 could not be processed",
    time: "2 hours ago",
    read: false,
    category: "orders",
  },
  {
    id: 5,
    type: "info",
    title: "System Update",
    message: "Inventory management system has been updated to version 2.1",
    time: "1 day ago",
    read: true,
    category: "system",
  },
]

const notificationSettings = [
  {
    category: "orders",
    label: "Order Notifications",
    description: "New orders, status updates, and payment alerts",
    enabled: true,
    icon: ShoppingCart,
  },
  {
    category: "inventory",
    label: "Inventory Alerts",
    description: "Low stock warnings and inventory updates",
    enabled: true,
    icon: Package,
  },
  {
    category: "customers",
    label: "Customer Updates",
    description: "New registrations and customer activity",
    enabled: false,
    icon: Users,
  },
  {
    category: "system",
    label: "System Notifications",
    description: "System updates and maintenance alerts",
    enabled: true,
    icon: Settings,
  },
]

export function AdminNotifications() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [settings, setSettings] = useState(notificationSettings)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotificationList((prev) => prev.filter((notif) => notif.id !== id))
  }

  // Toggle a notification-category switch
  const toggleSetting = (category: string) => {
    setSettings((prev) => prev.map((s) => (s.category === category ? { ...s, enabled: !s.enabled } : s)))
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications Center</h1>
          <p className="text-muted-foreground">View alerts in real-time and manage what you want to receive</p>
        </div>
        <Button size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      {/* Notification list */}
      <div className="space-y-4">
        {notificationList.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 p-4 rounded-lg border ${!n.read ? "bg-muted/50" : ""}`}>
            {/* icon */}
            <div className="pt-1">{getNotificationIcon(n.type)}</div>

            {/* main content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{n.title}</h3>
                <div className="text-xs text-muted-foreground">{n.time}</div>
              </div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              {!n.read && (
                <Button variant="link" size="xs" className="p-0 h-4" onClick={() => markAsRead(n.id)}>
                  Mark as read
                </Button>
              )}
            </div>

            {/* delete */}
            <Button variant="ghost" size="icon" onClick={() => deleteNotification(n.id)}>
              <span className="sr-only">Delete</span>
              <svg
                className="h-4 w-4 text-muted-foreground"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </Button>
          </div>
        ))}
      </div>

      {/* Notification preferences */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {settings.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.category} className="flex items-start gap-4 p-4 border rounded-lg">
                <Icon className="h-5 w-5 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{s.label}</p>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
                <Switch checked={s.enabled} onCheckedChange={() => toggleSetting(s.category)} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
