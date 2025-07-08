"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "@/utils/axios"
import { useAdmin } from "@/lib/admin"
import { Package2, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await login({ email, password });
      if (data.user?.role === "admin" && data.token && data.status === 200) {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again later."
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-purple-200 via-pink-150 to-gray-300 
             [animation:fadeInOut_3s_ease-in-out_infinite] ">
     
     <div className="w-full max-w-6xl lg:grid md:grid-cols-2 md:gap-8 flex flex-col  items-center justify-center m-auto">

     <div className=" lg:flex flex-col items-center justify-center text-center space-y-6 absolute top-10 md:relative m-5 lg:m-auto">
          <div className="flex items-center space-x-3  justify-center">
            <div className="p-3 bg-primary rounded-xl">
              <Package2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Nayak Enterprises</h1>
              <p className="text-lg text-muted-foreground">Admin Portal</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md hidden md:block">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-muted-foreground">
                Protected admin portal for managing your wholesale business operations, analytics, and system settings.
              </p>
            </div>
          </div>
        </div>
     
     
      <Card className="w-full max-w-md shadow-lg m-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@nayak.com"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
