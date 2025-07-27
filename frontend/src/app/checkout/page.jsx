"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from 'react-redux'
import { ArrowLeft, CreditCard, Truck, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/lib/auth'
import { fetchCart, getTotalPrice, clearError } from '@/store/cartSlice'
import { createOrder, clearError as clearOrderError } from '@/store/orderSlice'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuth()
  
  const items = useSelector((state) => state.cart.items)
  const status = useSelector((state) => state.cart.status)
  const error = useSelector((state) => state.cart.error)
  const subtotal = useSelector(getTotalPrice)
  const orderStatus = useSelector((state) => state.order.status)
  const orderError = useSelector((state) => state.order.error)
  
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [customerNotes, setCustomerNotes] = useState("")
  
  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    instructions: ""
  })

  // Load cart and user data
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
      dispatch(clearError())
    }
  }, [error, toast, dispatch])

  useEffect(() => {
    if (orderError) {
      toast({
        title: "Order Error",
        description: orderError.message || "Failed to place order",
        variant: "destructive",
      })
      dispatch(clearOrderError())
    }
  }, [orderError, toast, dispatch])

  // Pre-fill shipping address with user data if available
  useEffect(() => {
    if (user && user.address) {
      setShippingAddress({
        street: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        pincode: user.address.pincode || "",
        phone: user.phone || "",
        instructions: ""
      })
    }
  }, [user])

  // Calculate totals
  const originalTotal = items.reduce(
    (sum, item) => sum + (item.originalPrice || item.unitPrice) * item.quantity,
    0
  )
  const savings = originalTotal - subtotal
  const shipping = subtotal > 10000 ? 0 : 500
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + shipping + tax

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const requiredFields = ['street', 'city', 'state', 'pincode', 'phone']
    for (const field of requiredFields) {
      if (!shippingAddress[field]?.trim()) {
        toast({
          title: "Validation Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          variant: "destructive",
        })
        return false
      }
    }
    
    // Validate phone number
    if (!/^[0-9]{10,11}$/.test(shippingAddress.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10 or 11-digit phone number",
        variant: "destructive",
      })
      return false
    }
    
    // Validate pincode
    if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
      toast({
        title: "Invalid PIN Code",
        description: "Please enter a valid 6-digit PIN code",
        variant: "destructive",
      })
      return false
    }
    
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return
    
    const orderData = {
      paymentMethod,
      shippingAddress,
      customerNotes
    }
    
    const result = await dispatch(createOrder(orderData))
    
    if (createOrder.fulfilled.match(result)) {
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${result.payload.orderNumber} has been placed.`,
      })
      
      // Redirect to order confirmation
      router.push(`/orders/${result.payload._id}`)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to checkout</h1>
        <p className="text-muted-foreground mb-6">You must be signed in to complete your order.</p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading checkout...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some products to your cart to proceed with checkout.</p>
        <Button asChild>
          <Link href="/catalog">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      placeholder="Enter your street address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      placeholder="Enter 6-digit PIN code"
                      maxLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      placeholder="Enter 10-digit phone number"
                      maxLength={11}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      value={shippingAddress.instructions}
                      onChange={(e) => handleAddressChange('instructions', e.target.value)}
                      placeholder="Any special delivery instructions..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Pay when you receive your order
                  </p>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Any special instructions or notes for your order..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Savings</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Items Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="truncate flex-1">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="ml-2">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{items.length - 3} more items
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePlaceOrder}
              disabled={orderStatus === 'loading'}
            >
              {orderStatus === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order - ₹{total.toFixed(2)}
                </>
              )}
            </Button>

            {/* Security Notice */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Your order is secure and protected by our privacy policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 