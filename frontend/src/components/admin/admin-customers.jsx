"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Edit, Eye, Phone, Mail, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AdminCustomers() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Sharma General Store",
      email: "sharma@email.com",
      phone: "+91 98765 43210",
      address: "123 Main Street, Market Area",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      businessType: "Retail",
      status: "Active",
      totalOrders: 25,
      totalSpent: 125000,
      lastOrder: "2024-01-15",
      registrationDate: "2023-06-15",
    },
    {
      id: 2,
      name: "Kumar Retail Hub",
      email: "kumar@email.com",
      phone: "+91 87654 32109",
      address: "456 Commerce Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      businessType: "Wholesale",
      status: "Active",
      totalOrders: 18,
      totalSpent: 89000,
      lastOrder: "2024-01-14",
      registrationDate: "2023-08-20",
    },
    {
      id: 3,
      name: "Patel Wholesale Mart",
      email: "patel@email.com",
      phone: "+91 76543 21098",
      address: "789 Trade Center",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001",
      businessType: "Wholesale",
      status: "Active",
      totalOrders: 32,
      totalSpent: 198000,
      lastOrder: "2024-01-13",
      registrationDate: "2023-04-10",
    },
  ])

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [viewingCustomer, setViewingCustomer] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    businessType: "",
    status: "Active",
  })

  const businessTypes = ["Retail", "Wholesale", "Restaurant", "Hotel", "Distributor"]
  const states = ["Maharashtra", "Delhi", "Gujarat", "Karnataka", "Tamil Nadu", "West Bengal"]

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const customer = {
      id: Date.now(),
      ...newCustomer,
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: "Never",
      registrationDate: new Date().toISOString().split("T")[0],
    }

    setCustomers((prev) => [...prev, customer])
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      businessType: "",
      status: "Active",
    })
    setIsAddCustomerOpen(false)

    toast({
      title: "Customer Added",
      description: `${customer.name} has been added successfully`,
    })
  }

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return

    setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? editingCustomer : c)))
    setEditingCustomer(null)

    toast({
      title: "Customer Updated",
      description: `${editingCustomer.name} has been updated successfully`,
    })
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "secondary"
      case "Suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage wholesale customers and their information</p>
        </div>
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Create a new wholesale customer account</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={newCustomer.businessType}
                  onValueChange={(value) => setNewCustomer((prev) => ({ ...prev, businessType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  value={newCustomer.state}
                  onValueChange={(value) => setNewCustomer((prev) => ({ ...prev, state: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={newCustomer.pincode}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{customers.filter((c) => c.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Active Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>Manage your wholesale customer database</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.businessType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>
                        {customer.city}, {customer.state}
                      </p>
                      <p className="text-muted-foreground">{customer.pincode}</p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>₹{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeColor(customer.status)}>{customer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setViewingCustomer(customer)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingCustomer(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Customer Dialog */}
      <Dialog open={!!viewingCustomer} onOpenChange={() => setViewingCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Complete information about the customer</DialogDescription>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Business Information</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {viewingCustomer.name}
                    </p>
                    <p>
                      <strong>Type:</strong> {viewingCustomer.businessType}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <Badge variant={getStatusBadgeColor(viewingCustomer.status)}>{viewingCustomer.status}</Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {viewingCustomer.email}
                    </p>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {viewingCustomer.phone}
                    </p>
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {viewingCustomer.city}, {viewingCustomer.state}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p>{viewingCustomer.address}</p>
                <p>
                  {viewingCustomer.city}, {viewingCustomer.state} - {viewingCustomer.pincode}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Statistics</h3>
                  <p>
                    <strong>Total Orders:</strong> {viewingCustomer.totalOrders}
                  </p>
                  <p>
                    <strong>Total Spent:</strong> ₹{viewingCustomer.totalSpent.toLocaleString()}
                  </p>
                  <p>
                    <strong>Last Order:</strong> {viewingCustomer.lastOrder}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Account Info</h3>
                  <p>
                    <strong>Registered:</strong> {viewingCustomer.registrationDate}
                  </p>
                  <p>
                    <strong>Customer ID:</strong> CUST-{viewingCustomer.id.toString().padStart(4, "0")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Business Name</Label>
                <Input
                  id="edit-name"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingCustomer.status}
                  onValueChange={(value) => setEditingCustomer((prev) => (prev ? { ...prev, status: value } : null))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer((prev) => (prev ? { ...prev, address: e.target.value } : null))}
                />
              </div>
              <div className="flex justify-end space-x-2 col-span-2 mt-4">
                <Button variant="outline" onClick={() => setEditingCustomer(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCustomer}>Update Customer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
