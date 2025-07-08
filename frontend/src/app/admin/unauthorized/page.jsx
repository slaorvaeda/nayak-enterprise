import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this resource.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Your current role doesn't include the necessary permissions for this page. Please contact your administrator
            if you believe this is an error.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/login">Switch Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
