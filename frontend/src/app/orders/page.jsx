"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Package, Clock, CheckCircle, Truck, AlertCircle, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/lib/auth'
import { fetchOrders, selectOrders, selectOrderStatus, selectOrderError, selectOrderPagination, clearError } from '@/store/orderSlice'

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'confirmed':
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case 'processing':
      return <Package className="h-4 w-4 text-purple-600" />
    case 'shipped':
      return <Truck className="h-4 w-4 text-green-600" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'cancelled':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
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

export default function OrdersPage() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  
  const orders = useSelector(selectOrders)
  const status = useSelector(selectOrderStatus)
  const error = useSelector(selectOrderError)
  const pagination = useSelector(selectOrderPagination)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders({ page: currentPage, limit: 10, status: statusFilter }))
    }
  }, [dispatch, isAuthenticated, currentPage, statusFilter])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load orders",
        variant: "destructive",
      })
      dispatch(clearError())
    }
  }, [error, toast, dispatch])

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your orders</h1>
        <p className="text-muted-foreground mb-6">You must be signed in to view your order history.</p>
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
        <p className="mt-2 text-muted-foreground">Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">Track your order history and status</p>
          </div>
          <Button asChild>
            <Link href="/catalog">Continue Shopping</Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter === 'All' 
                  ? "You haven't placed any orders yet." 
                  : `No ${statusFilter} orders found.`
                }
              </p>
              <Button asChild>
                <Link href="/catalog">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span> {order.items.length} products
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> ₹{order.total.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Payment:</span> {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mt-4">
                        <div className="flex gap-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Image
                                src={(item.product?.images?.[0]?.url || "/placeholder.svg").trimEnd()}
                                alt={item.name}
                                width={32}
                                height={32}
                                className="rounded object-cover"
                              />
                              <span className="truncate max-w-20">{item.name}</span>
                              <span className="text-muted-foreground">×{item.quantity}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-sm text-muted-foreground">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button asChild variant="outline">
                        <Link href={`/orders/${order._id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
