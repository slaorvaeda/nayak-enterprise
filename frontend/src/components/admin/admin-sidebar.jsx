"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Bell,
  FileText,
  Home,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Eye,
  UserCheck,
  TrendingUp,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Live View", href: "/admin/live-view", icon: Eye },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "User Management", href: "/admin/users", icon: UserCheck },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Sales Reports", href: "/admin/sales", icon: TrendingUp },
  { title: "Reports", href: "/admin/reports", icon: FileText },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function SidebarToggle({ onClick }) {
  return (
    <button
      className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors lg:hidden"
      onClick={onClick}
      aria-label="Open sidebar"
      type="button"
    >
      <Menu className="h-6 w-6" />
    </button>
  )
}

export function AdminSidebar({ isOpen, onClose, className }) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a href="/admin" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Admin Panel</span>
        </a>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="grid gap-1">
          {sidebarItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </a>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden border-r bg-muted/40 h-screen lg:block md:sticky md:top-0 md:left-0 md:h-screen", className)}>
        <SidebarContent />
      </div>
      {/* Mobile Sidebar & Overlay */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-500",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-10 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded transition-colors lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
