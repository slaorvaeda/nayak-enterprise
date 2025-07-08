"use client"
import { AdminSidebar, SidebarToggle } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AuthGuard } from "@/components/admin/auth-guard"
// import { Toaster } from "@/components/toaster"
import ThemeProvider from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { AdminProtected } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin";

// Removed metadata export due to client component restriction

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const { isAuthenticated, user } = useAdmin();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [isAuthenticated, user, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {isLoginPage ? (
        children
      ) : (
        <AdminProtected>
          <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            
            {/* Mobile Sidebar & Overlay */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header with sidebar toggle for mobile */}
              {!isLoginPage && (
                <div className="flex items-center h-14 px-4 border-b md:px-0 md:border-0">
                  <SidebarToggle onClick={() => setSidebarOpen(true)} />
                  <div className="flex-1">
                    <AdminHeader />
                  </div>
                </div>
              )}
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
        </AdminProtected>
      )}
      <Toaster />
    </ThemeProvider>
  )
}
