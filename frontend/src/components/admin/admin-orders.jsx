"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Eye, Edit, Package, Truck, CheckCircle, XCircle, Clock, FileText, Download, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "@/utils/axios"
import jsPDF from "jspdf";
import { generateInvoicePDF } from "./InvoicePDF";


export function AdminOrders() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get("/admin/orders")
        setOrders(res.data.data.orders)
      } catch (err) {
        setError("Failed to fetch orders")
        toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const [viewingOrder, setViewingOrder] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [showInvoice, setShowInvoice] = useState(null)
  const [saving, setSaving] = useState(false)

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"]
  const paymentStatusOptions = ["Pending", "Paid", "Failed", "Refunded"]

  // Helper to capitalize status for display
  function capitalize(word) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const filteredOrders = orders.filter((order) => {
    const orderId = (order.orderNumber || order._id || "").toString();
    const customerName = order.customer?.businessName || "";
    const customerEmail = order.customer?.email || "";
    const matchesSearch =
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              deliveryDate: newStatus === "Delivered" ? new Date().toISOString().split("T")[0] : order.deliveryDate,
            }
          : order,
      ),
    )

    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    })
  }

  const handleUpdatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order)),
    )

    toast({
      title: "Payment Status Updated",
      description: `Payment status for order ${orderId} changed to ${newPaymentStatus}`,
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Processing":
        return <Package className="h-4 w-4" />
      case "Shipped":
        return <Truck className="h-4 w-4" />
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />
      case "Cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Processing":
        return "default"
      case "Shipped":
        return "outline"
      case "Delivered":
        return "default"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Paid":
        return "default"
      case "Failed":
        return "destructive"
      case "Refunded":
        return "outline"
      default:
        return "secondary"
    }
  }

  const generateInvoice = (order) => {
    setShowInvoice(order)
  }

  const downloadInvoice = (order) => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for order ${order.id} has been downloaded.`,
    })
  }

  function handleDownloadInvoice(order) {
    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(18);
    doc.text("Nayak Enterprises", 10, y);
    doc.setFontSize(10);
    doc.text("Wholesale Distribution", 10, y + 6);
    doc.text("123 Business District, City, State 12345", 10, y + 12);
    doc.text("Phone: +91 98765 43210", 10, y + 18);
    doc.text("Email: info@nayakenterprises.com", 10, y + 24);

    y += 32;
    doc.setFontSize(16);
    doc.text(`INVOICE`, 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(12);
    doc.text(`Invoice #: ${order.orderNumber || order._id}`, 10, y);
    doc.text(`Date: ${order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}`, 150, y);
    y += 8;

    // Customer Info
    doc.setFontSize(12);
    doc.text("Bill To:", 10, y);
    doc.text(order.customer?.businessName || "", 30, y);
    y += 6;
    doc.text(order.customer?.email || "", 30, y);
    y += 6;
    doc.text(order.customer?.phone || "", 30, y);
    y += 10;

    // Items Table Header
    doc.setFontSize(12);
    doc.text("Product", 10, y);
    doc.text("Qty", 90, y);
    doc.text("Unit Price", 110, y);
    doc.text("Total", 160, y);
    y += 4;
    doc.line(10, y, 200, y);
    y += 6;

    // Items Table Rows
    order.items?.forEach((item, idx) => {
      doc.text(item.name || "", 10, y);
      doc.text(String(item.quantity ?? 0), 92, y, { align: "right" });
      doc.text(`₹${(item.unitPrice ?? item.price ?? 0).toLocaleString()}`, 112, y, { align: "right" });
      doc.text(`₹${(item.totalPrice ?? item.total ?? 0).toLocaleString()}`, 162, y, { align: "right" });
      y += 7;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    y += 4;
    doc.line(10, y, 200, y);
    y += 8;

    // Totals
    doc.setFontSize(12);
    doc.text(`Subtotal:`, 130, y);
    doc.text(`₹${(order.subtotal ?? 0).toLocaleString()}`, 200, y, { align: "right" });
    y += 7;
    doc.text(`Tax:`, 130, y);
    doc.text(`₹${(order.tax ?? 0).toLocaleString()}`, 200, y, { align: "right" });
    y += 7;
    doc.text(`Shipping:`, 130, y);
    doc.text(`₹${(order.shippingCost ?? order.shipping ?? 0).toLocaleString()}`, 200, y, { align: "right" });
    y += 7;
    doc.setFontSize(14);
    doc.text(`Total:`, 130, y);
    doc.text(`₹${(order.total ?? 0).toLocaleString()}`, 200, y, { align: "right" });
    y += 12;

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 10, y);
    doc.text("For any queries, contact us at info@nayakenterprises.com", 10, y + 6);

    doc.save(`invoice-${order.orderNumber || order._id}.pdf`);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Order Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold sm:text-2xl">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold sm:text-2xl">
              {orders.filter((o) => o.status === "processing").length}
            </div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold sm:text-2xl">{orders.filter((o) => o.status === "shipped").length}</div>
            <p className="text-xs text-muted-foreground">Shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold sm:text-2xl">
              {orders.filter((o) => o.status === "delivered").length}
            </div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold sm:text-2xl">
              ₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Manage and track all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Order ID</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[80px]">Items</TableHead>
                  <TableHead className="min-w-[100px]">Total</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Payment</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.orderNumber || order._id}>
                      <TableCell className="font-medium">{order.orderNumber || order._id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer?.businessName}</p>
                          <p className="text-xs text-muted-foreground hidden sm:block">{order.customer?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.items?.length ?? 0} items</TableCell>
                      <TableCell>₹{(order.total ?? 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <Badge variant={getStatusColor(order.status)}>{capitalize(order.status)}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setViewingOrder(order)}>
                            <Eye className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingOrder(order)}>
                            <Edit className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => generateInvoice(order)}>
                            <FileText className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Invoice</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {viewingOrder?.id}</DialogTitle>
            <DialogDescription>Complete order information and status</DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {viewingOrder.customer?.businessName}
                    </p>
                    <p>
                      <strong>Email:</strong> {viewingOrder.customer?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {viewingOrder.customer?.phone}
                    </p>
                    <p>
                      <strong>Order Date:</strong> {viewingOrder.orderDate ? new Date(viewingOrder.orderDate).toLocaleDateString() : "-"}
                    </p>
                    {viewingOrder.deliveryDate && (
                      <p>
                        <strong>Delivery Date:</strong> {viewingOrder.deliveryDate}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Order Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <strong>Status:</strong>
                      {getStatusIcon(viewingOrder.status)}
                      <Badge variant={getStatusColor(viewingOrder.status)}>{capitalize(viewingOrder.status)}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <strong>Payment:</strong>
                      <Badge variant={getPaymentStatusColor(viewingOrder.paymentStatus)}>
                        {viewingOrder.paymentStatus}
                      </Badge>
                    </div>
                    <p>
                      <strong>Payment Method:</strong> {viewingOrder.paymentMethod}
                    </p>
                    {viewingOrder.trackingNumber && (
                      <p>
                        <strong>Tracking:</strong> {viewingOrder.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <p>
                    {viewingOrder.shippingAddress?.street}, {viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.state} - {viewingOrder.shippingAddress?.pincode}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Billing Address</h3>
                  <p>{viewingOrder.billingAddress}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.unitPrice ?? item.price}</TableCell>
                          <TableCell>₹{(item.totalPrice ?? item.total ?? 0).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 space-y-2 text-right">
                  <p>Subtotal: ₹{(viewingOrder.subtotal ?? 0).toLocaleString()}</p>
                  <p>Tax: ₹{(viewingOrder.tax ?? 0).toLocaleString()}</p>
                  <p>Shipping: ₹{(viewingOrder.shippingCost ?? 0).toLocaleString()}</p>
                  <Separator />
                  <p className="text-lg font-semibold">Total: ₹{(viewingOrder.total ?? 0).toLocaleString()}</p>
                </div>
              </div>

              {viewingOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-3">Notes</h3>
                  <p className="text-sm text-muted-foreground">{viewingOrder.notes}</p>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => generateInvoice(viewingOrder)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Invoice
                </Button>
                <Button variant="outline" onClick={() => downloadInvoice(viewingOrder)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order - {editingOrder?.orderNumber || editingOrder?._id}</DialogTitle>
            <DialogDescription>Update order status and payment information</DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="order-status">Order Status</Label>
                <Select
                  value={editingOrder.status ?? ""}
                  onValueChange={(value) => {
                    setEditingOrder((prev) => (prev ? { ...prev, status: value } : null))
                    handleUpdateOrderStatus(editingOrder.orderNumber || editingOrder._id, value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {capitalize(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment-status">Payment Status</Label>
                <Select
                  value={editingOrder.paymentStatus ?? ""}
                  onValueChange={(value) => {
                    setEditingOrder((prev) => (prev ? { ...prev, paymentStatus: value } : null))
                    handleUpdatePaymentStatus(editingOrder.orderNumber || editingOrder._id, value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tracking-number">Tracking Number</Label>
                <Input
                  id="tracking-number"
                  value={editingOrder.trackingNumber ?? ""}
                  onChange={(e) =>
                    setEditingOrder((prev) => (prev ? { ...prev, trackingNumber: e.target.value } : null))
                  }
                  placeholder="Enter tracking number"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editingOrder.notes ?? ""}
                  onChange={(e) => setEditingOrder((prev) => (prev ? { ...prev, notes: e.target.value } : null))}
                  placeholder="Add notes..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingOrder(null)}>
                  Close
                </Button>
                <Button
                  variant="default"
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true)
                    try {
                      const orderId = editingOrder._id;
                      const res = await axios.put(`/admin/orders/${orderId}/status`, {
                        status: editingOrder.status,
                        trackingNumber: editingOrder.trackingNumber,
                        adminNotes: editingOrder.notes,
                      })
                      // Update order in state
                      setOrders((prev) =>
                        prev.map((order) =>
                          (order.orderNumber || order._id) === orderId
                            ? { ...order, ...res.data.data.order }
                            : order
                        )
                      )
                      toast({ title: "Order updated", description: "Order updated successfully" })
                      setEditingOrder(null)
                    } catch (err) {
                      toast({ title: "Error", description: "Failed to update order", variant: "destructive" })
                    } finally {
                      setSaving(false)
                    }
                  }}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={!!showInvoice} onOpenChange={() => setShowInvoice(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice - {showInvoice?.id}</DialogTitle>
            <DialogDescription>Order invoice details</DialogDescription>
          </DialogHeader>
          {showInvoice && (
            <div className="space-y-6 p-6 bg-white text-black">
              {/* Invoice Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Nayak Enterprises</h2>
                  <p className="text-sm text-gray-600">Wholesale Distribution</p>
                  <p className="text-sm text-gray-600">123 Business District, City, State 12345</p>
                  <p className="text-sm text-gray-600">Phone: +91 98765 43210</p>
                  <p className="text-sm text-gray-600">Email: info@nayakenterprises.com</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold">INVOICE</h3>
                  <p className="text-sm">Invoice #: {showInvoice.id}</p>
                  <p className="text-sm">Date: {showInvoice.orderDate}</p>
                  {showInvoice.deliveryDate && <p className="text-sm">Delivery: {showInvoice.deliveryDate}</p>}
                </div>
              </div>

              <Separator />

              {/* Customer Details */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Bill To:</h4>
                  <p className="font-medium">{showInvoice.customer?.businessName}</p>
                  <p className="text-sm">{showInvoice.customer?.email}</p>
                  <p className="text-sm">{showInvoice.customer?.phone}</p>
                  <p className="text-sm mt-2">{showInvoice.billingAddress}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ship To:</h4>
                  <p className="text-sm">
                    {showInvoice.shippingAddress?.street}, {showInvoice.shippingAddress?.city}, {showInvoice.shippingAddress?.state} - {showInvoice.shippingAddress?.pincode}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm">
                      <strong>Payment Method:</strong> {showInvoice.paymentMethod}
                    </p>
                    <p className="text-sm">
                      <strong>Payment Status:</strong> {showInvoice.paymentStatus}
                    </p>
                    {showInvoice.trackingNumber && (
                      <p className="text-sm">
                        <strong>Tracking:</strong> {showInvoice.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {showInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{(item.unitPrice ?? item.price ?? 0).toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{(item.totalPrice ?? item.total ?? 0).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{showInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>₹{showInvoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{(showInvoice.shippingCost ?? showInvoice.shipping ?? 0).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{showInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-600 mt-8">
                <p>Thank you for your business!</p>
                <p>For any queries, contact us at info@nayakenterprises.com</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="default" onClick={() => generateInvoicePDF(showInvoice)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="text-black dark:text-white" onClick={() => setShowInvoice(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
