"use client"

import { Home, Search, ArrowLeft, Package2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6">
            <Package2 className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What would you like to do?</CardTitle>
            <CardDescription>
              Here are some helpful links to get you back on track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/catalog">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Pages</CardTitle>
            <CardDescription>
              These pages might be what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Shopping</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <Link href="/catalog" className="hover:text-foreground transition-colors">
                      Product Catalog
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:text-foreground transition-colors">
                      Product Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="hover:text-foreground transition-colors">
                      Shopping Cart
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Account</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <Link href="/login" className="hover:text-foreground transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-foreground transition-colors">
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="hover:text-foreground transition-colors">
                      My Profile
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you're having trouble finding what you're looking for, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/about">About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 