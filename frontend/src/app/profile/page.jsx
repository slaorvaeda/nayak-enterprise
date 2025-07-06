"use client"

import { Building, Edit, MapPin, Save, User, Package, ShoppingCart, Clock, Star } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"

// Mock recent orders data (this could be fetched from backend later)
const recentOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    items: 12,
    total: 15750,
    status: "Delivered",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    items: 8,
    total: 9200,
    status: "In Transit",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    items: 15,
    total: 22100,
    status: "Delivered",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({})
  const { toast } = useToast()
  const { getProfile, updateProfile, user, isAuthenticated } = useAuth()

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        // console.log("Fetching profile...")
        
        if (!isAuthenticated) {
          setError("No authentication token found. Please login again.")
          setLoading(false)
          return
        }
        
        const response = await getProfile()
        // console.log("Profile response:", response)
        
        if (response.success) {
          const user = response.user
          setUserData(user)
          setFormData({
            businessName: user.businessName || "",
            businessType: user.businessType || "",
            ownerName: user.ownerName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            pincode: user.address?.pincode || "",
            gstNumber: user.gstNumber || "",
            businessDescription: user.businessDescription || "",
          })
        } else {
          setError(response.error || "Failed to fetch profile")
        }
      } catch (err) {
        console.error("Profile fetch error:", err)
        setError(`Failed to load profile data: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [getProfile, isAuthenticated])

  // Update form data when user data changes
  useEffect(() => {
    if (user && !userData) {
      setUserData(user)
      setFormData({
        businessName: user.businessName || "",
        businessType: user.businessType || "",
        ownerName: user.ownerName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
        gstNumber: user.gstNumber || "",
        businessDescription: user.businessDescription || "",
      })
    }
  }, [user, userData])

  const handleSave = async () => {
    try {
      setIsEditing(false)
      
      // Prepare profile data for update
      const profileData = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        ownerName: formData.ownerName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        gstNumber: formData.gstNumber,
        businessDescription: formData.businessDescription,
      }
      
      const result = await updateProfile(profileData)
      
      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        })
        // Refresh the profile data
        const refreshResult = await getProfile()
        if (refreshResult.success) {
          setUserData(refreshResult.user)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        })
        setIsEditing(true) // Keep editing mode on error
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
      setIsEditing(true) // Keep editing mode on error
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error && error.includes("No authentication token found")) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-blue-600 mb-2">Authentication Required</h2>
                  <p className="text-muted-foreground mb-4">
                    You need to be logged in to view your profile. Please sign in to continue.
                  </p>
                  <div className="space-y-4">
                    <Button onClick={() => window.location.href = '/login'}>
                      Go to Login
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Test Credentials:</p>
                      <p>Email: john@samplestore.com</p>
                      <p>Password: customer123</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!userData) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">No Profile Data</h2>
                  <p className="text-muted-foreground">Unable to load profile information.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireAuth={true}>
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20 flex-shrink-0">
                <AvatarImage src={userData.image || "/placeholder.svg?height=80&width=80"} />
                <AvatarFallback className="text-lg">
                  {userData.ownerName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold break-words">{userData.businessName}</h1>
                <p className="text-muted-foreground">Owner: {userData.ownerName}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <Badge variant="secondary" className="w-fit">{userData.businessType}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date(userData.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="w-full sm:w-auto flex-shrink-0"
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold">{userData.totalOrders || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold">₹{(userData.totalSpent || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold">{Math.floor((userData.totalSpent || 0) / 100)}</p>
                  <p className="text-xs text-muted-foreground">Loyalty Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Pending Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Profile Details</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Order History</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange("businessType", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Describe your business..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your recent order history and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <Separator orientation="horizontal" className="sm:hidden" />
                        <Separator orientation="vertical" className="hidden sm:block h-8" />
                        <div>
                          <p className="text-sm">{order.items} items</p>
                          <p className="font-medium">₹{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "In Transit"
                              ? "secondary"
                              : "outline"
                        }
                        className="w-fit"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Change Password</h4>
                  <Button variant="outline">Update Password</Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Notification Preferences</h4>
                  <Button variant="outline">Manage Notifications</Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Download Data</h4>
                  <Button variant="outline">Export Account Data</Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Danger Zone</h4>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  )
}
