"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function ProtectedRoute({ 
  children, 
  requireAuth = false, 
  requireGuest = false,
  redirectTo = "/profile" 
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If route requires authentication and user is not logged in
    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // If route requires guest (non-authenticated) and user is logged in
    if (requireGuest && isAuthenticated) {
      router.push(redirectTo);
      return;
    }
  }, [isAuthenticated, requireAuth, requireGuest, redirectTo, router]);

  // Show loading or nothing while checking auth status
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If route requires guest and user is authenticated, don't render children
  if (requireGuest && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return children;
} 