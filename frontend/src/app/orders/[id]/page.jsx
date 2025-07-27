"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle, Package, Truck, Clock, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/lib/auth'
import { fetchOrderById, selectCurrentOrder, selectOrderStatus, selectOrderError, clearError } from '@/store/orderSlice'

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-600" />
    case 'confirmed':
      return <CheckCircle className="h-5 w-5 text-blue-600" />
    case 'processing':
      return <Package className="h-5 w-5 text-purple-600" />
    case 'shipped':
      return <Truck className="h-5 w-5 text-green-600" />
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case 'cancelled':
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Clock className="h-5 w-5 text-gray-600" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-purple-100 text-purple-800'
    case 'shipped':
      return 'bg-green-100 text-green-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  
  const order = useSelector(selectCurrentOrder)
  const status = useSelector(selectOrderStatus)
  const error = useSelector(selectOrderError)

  useEffect(() => {
    if (isAuthenticated && params.id) {
      dispatch(fetchOrderById(params.id))
    }
  }, [dispatch, isAuthenticated, params.id])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load order details",
        variant: "destructive",
      })
      dispatch(clearError())
    }
  }, [error, toast, dispatch])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view order details</h1>
        <p className="text-muted-foreground mb-6">You must be signed in to view your orders.</p>
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
        <p className="mt-2 text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button asChild>
          <Link href="/orders">View All Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {order.statusUpdatedAt && `Updated ${new Date(order.statusUpdatedAt).toLocaleDateString()}`}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Image
                      src={(item.product?.images?.[0]?.url || "/placeholder.svg").trimEnd()}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">₹{item.unitPrice} each</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.shippingAddress.street}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
                  )}
                  {order.shippingAddress.instructions && (
                    <p className="text-muted-foreground">Instructions: {order.shippingAddress.instructions}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Notes */}
            {order.customerNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{order.customerNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({order.items.length} items)</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (GST 18%)</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Method:</span>
                    <span className="text-sm font-medium">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge variant={order.paymentMethod === 'cod' ? 'secondary' : 'default'}>
                      {order.paymentMethod === 'cod' ? 'Pending' : 'Paid'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/orders">View All Orders</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/catalog">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 