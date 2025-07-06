"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminOverview } from "./admin-overview"
import { AdminProducts } from "./admin-products"
import { AdminOrders } from "./admin-orders"
import { AdminCustomers } from "./admin-customers"
import { AdminSettings } from "./admin-settings"
import { AdminAnalytics } from "./admin-analytics"
import { AdminNotifications } from "./admin-notifications"
import { AdminHeader } from "./admin-header"

export function AdminDashboard({ currentUser, onLogout }) {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />
      case "products":
        return <AdminProducts />
      case "orders":
        return <AdminOrders />
      case "customers":
        return <AdminCustomers />
      case "analytics":
        return <AdminAnalytics />
      case "settings":
        return <AdminSettings />
      case "notifications":
        return <AdminNotifications />
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader currentUser={currentUser} onLogout={onLogout} />
      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
