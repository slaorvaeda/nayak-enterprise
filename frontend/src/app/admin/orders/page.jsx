"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminOrders } from "@/components/admin/admin-orders"
import { AuthGuard } from "@/components/admin/auth-guard"

// Mock orders data
const orders = [
  {
    id: "ORD-2024-001",
    customer: "Sharma General Store",
    customerEmail: "sharma@example.com",
    date: "2024-01-15",
    status: "Delivered",
    items: 12,
    total: 15750,
    paymentStatus: "Paid",
  },
  {
    id: "ORD-2024-002",
    customer: "Patel Retail Shop",
    customerEmail: "patel@example.com",
    date: "2024-01-14",
    status: "In Transit",
    items: 8,
    total: 9200,
    paymentStatus: "Paid",
  },
  {
    id: "ORD-2024-003",
    customer: "Kumar Store",
    customerEmail: "kumar@example.com",
    date: "2024-01-13",
    status: "Processing",
    items: 15,
    total: 22100,
    paymentStatus: "Pending",
  },
  {
    id: "ORD-2024-004",
    customer: "Gupta Enterprises",
    customerEmail: "gupta@example.com",
    date: "2024-01-12",
    status: "Cancelled",
    items: 6,
    total: 5400,
    paymentStatus: "Refunded",
  },
]

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [paymentFilter, setPaymentFilter] = useState("All")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || order.status === statusFilter
    const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full flex-col">
        {/* <AdminHeader /> */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <AdminOrders
            orders={filteredOrders}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
          />
        </main>
      </div>
    </AuthGuard>
  )
}
