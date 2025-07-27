"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Eye, Edit, Mail, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdmin } from "@/lib/admin"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { adminCreateUser, adminUpdateUser } from "@/services/adminService"

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getUsers } = useAdmin()
  const { toast } = useToast()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Add Customer form state
  const [addForm, setAddForm] = useState({
    ownerName: "",
    businessName: "",
    businessType: "",
    gstNumber: "",
    businessDescription: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    password: ""
  })
  const [addLoading, setAddLoading] = useState(false)
  const businessTypeOptions = [
    { value: "retail-store", label: "Retail Store" },
    { value: "supermarket", label: "Supermarket" },
    { value: "grocery-store", label: "Grocery Store" },
    { value: "convenience-store", label: "Convenience Store" },
    { value: "other", label: "Other" }
  ]

  // Edit Customer form state
  const [editForm, setEditForm] = useState(null)
  const [editLoading, setEditLoading] = useState(false)

  // Move fetchCustomers outside useEffect
  const fetchCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const users = await getUsers()
      console.log("Fetched users:", users)
      // Filter customers and add default values for missing fields
      const customerUsers = users
        .filter(user => user.role === "customer")
        .map(user => ({
          ...user,
          ownerName: user.ownerName || user.businessName || "Unknown",
          businessName: user.businessName || "Unknown Business",
          email: user.email || "No email",
          phone: user.phone || "No phone",
          totalOrders: user.totalOrders || 0,
          totalSpent: user.totalSpent || 0,
          isActive: user.isActive !== false, // Default to true if not specified
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown",
          address: user.address || { city: "Unknown" }
        }))
      setCustomers(customerUsers)
    } catch (err) {
      console.error("Error fetching customers:", err)
      if (err.response && err.response.status === 401) {
        setError("You are not authorized. Please log in as an admin.")
      } else {
        setError("Failed to load customers. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [getUsers])

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate customer stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive).length;
  const inactiveCustomers = customers.filter(c => !c.isActive).length;
  const newThisMonth = customers.filter(c => {
    if (!c.createdAt) return false;
    const created = new Date(c.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const handleAddCustomer = () => {
    setAddForm({
      ownerName: "",
      businessName: "",
      businessType: "",
      gstNumber: "",
      businessDescription: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      password: ""
    })
    setAddModalOpen(true)
  }

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setViewModalOpen(true)
  }

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer)
    setEditForm({
      ownerName: customer.ownerName || "",
      businessName: customer.businessName || "",
      businessType: customer.businessType || "",
      gstNumber: customer.gstNumber || "",
      businessDescription: customer.businessDescription || "",
      email: customer.email || "",
      phone: customer.phone || "",
      street: customer.address?.street || "",
      city: customer.address?.city || "",
      state: customer.address?.state || "",
      pincode: customer.address?.pincode || ""
    })
    setEditModalOpen(true)
  }

  // Add Customer submit
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    // Validate required fields
    if (!addForm.ownerName || !addForm.businessName || !addForm.businessType || !addForm.email || !addForm.phone || !addForm.street || !addForm.city || !addForm.state || !addForm.pincode || !addForm.password) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" })
      return
    }
    // Validate businessType
    if (!businessTypeOptions.some(opt => opt.value === addForm.businessType)) {
      toast({ title: "Error", description: "Please select a valid business type.", variant: "destructive" })
      return
    }
    setAddLoading(true)
    try {
      const payload = {
        ...addForm,
        businessType: addForm.businessType,
        address: {
          street: addForm.street,
          city: addForm.city,
          state: addForm.state,
          pincode: addForm.pincode
        }
      }
      // Remove fields not needed by backend
      delete payload.street
      delete payload.city
      delete payload.state
      delete payload.pincode
      await adminCreateUser(payload)
      toast({ title: "Customer added!" })
      setAddModalOpen(false)
      fetchCustomers()
    } catch (err) {
      const backendMsg = err?.response?.data?.message || err?.message || "Failed to add customer"
      toast({ title: "Error", description: backendMsg, variant: "destructive" })
    } finally {
      setAddLoading(false)
    }
  }

  // Edit Customer submit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      if (!selectedCustomer || !selectedCustomer._id) {
        toast({ title: "Error", description: "No customer selected for update.", variant: "destructive" })
        setEditLoading(false)
        return
      }
      const payload = {
        ...editForm,
        address: {
          street: editForm.street,
          city: editForm.city,
          state: editForm.state,
          pincode: editForm.pincode
        }
      }
      // Remove fields not needed by backend
      delete payload.street
      delete payload.city
      delete payload.state
      delete payload.pincode
      await adminUpdateUser(selectedCustomer._id, payload)
      toast({ title: "Customer updated!" })
      setEditModalOpen(false)
      fetchCustomers()
    } catch (err) {
      const backendMsg = err?.response?.data?.message || err?.message || "Failed to update customer"
      toast({ title: "Error", description: backendMsg, variant: "destructive" })
    } finally {
      setEditLoading(false)
    }
  }

  function CustomersSkeleton() {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-40 mb-2"><Skeleton className="h-8 w-40" /></div>
            <div className="h-4 w-64"><Skeleton className="h-4 w-64" /></div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        {/* Search */}
        <Skeleton className="h-12 w-full" />
        {/* Table */}
        <div className="rounded-lg border">
          <div className="p-6">
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <CustomersSkeleton />
  }
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your wholesale customers and partners</p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Active Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{inactiveCustomers}</div>
            <p className="text-xs text-muted-foreground">Inactive Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{newThisMonth}</div>
            <p className="text-xs text-muted-foreground">New This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>All registered wholesale customers</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No customers found matching your search." : "No customers found."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id || customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={customer.image} />
                          <AvatarFallback>
                            {customer.ownerName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.ownerName}</p>
                          <p className="text-sm text-muted-foreground">Joined {customer.joinDate}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.businessName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-3 w-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.address?.city || "Unknown"}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell className="font-medium">₹{customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={customer.isActive ? "default" : "secondary"}>
                        {customer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Add Customer Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <Label>Owner Name</Label>
            <Input value={addForm.ownerName} onChange={e => setAddForm(f => ({ ...f, ownerName: e.target.value }))} placeholder="Owner Name" required />
            <Label>Business Name</Label>
            <Input value={addForm.businessName} onChange={e => setAddForm(f => ({ ...f, businessName: e.target.value }))} placeholder="Business Name" required />
            <Label>Business Type</Label>
            <select
              className="w-full border rounded px-2 py-2"
              value={addForm.businessType}
              onChange={e => setAddForm(f => ({ ...f, businessType: e.target.value }))}
              required
            >
              <option value="">Select Business Type</option>
              {businessTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Label>GST Number</Label>
            <Input value={addForm.gstNumber} onChange={e => setAddForm(f => ({ ...f, gstNumber: e.target.value }))} placeholder="GST Number" />
            <Label>Business Description</Label>
            <Input value={addForm.businessDescription} onChange={e => setAddForm(f => ({ ...f, businessDescription: e.target.value }))} placeholder="Business Description" />
            <Label>Email</Label>
            <Input value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" required />
            <Label>Phone</Label>
            <Input value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" required />
            <Label>Street</Label>
            <Input value={addForm.street} onChange={e => setAddForm(f => ({ ...f, street: e.target.value }))} placeholder="Street" required />
            <Label>City</Label>
            <Input value={addForm.city} onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))} placeholder="City" required />
            <Label>State</Label>
            <Input value={addForm.state} onChange={e => setAddForm(f => ({ ...f, state: e.target.value }))} placeholder="State" required />
            <Label>Pincode</Label>
            <Input value={addForm.pincode} onChange={e => setAddForm(f => ({ ...f, pincode: e.target.value }))} placeholder="Pincode" required />
            <Label>Password</Label>
            <Input value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" type="password" required />
            <DialogFooter>
              <Button onClick={() => setAddModalOpen(false)} type="button" variant="secondary">Cancel</Button>
              <Button type="submit" disabled={addLoading}>{addLoading ? "Adding..." : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Customer Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && editForm ? (
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <Label>Owner Name</Label>
              <Input value={editForm.ownerName} onChange={e => setEditForm(f => ({ ...f, ownerName: e.target.value }))} required />
              <Label>Business Name</Label>
              <Input value={editForm.businessName} onChange={e => setEditForm(f => ({ ...f, businessName: e.target.value }))} required />
              <Label>Business Type</Label>
              <Input value={editForm.businessType} onChange={e => setEditForm(f => ({ ...f, businessType: e.target.value }))} />
              <Label>GST Number</Label>
              <Input value={editForm.gstNumber} onChange={e => setEditForm(f => ({ ...f, gstNumber: e.target.value }))} />
              <Label>Business Description</Label>
              <Input value={editForm.businessDescription} onChange={e => setEditForm(f => ({ ...f, businessDescription: e.target.value }))} />
              <Label>Email</Label>
              <Input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} type="email" required />
              <Label>Phone</Label>
              <Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} required />
              <Label>Street</Label>
              <Input value={editForm.street} onChange={e => setEditForm(f => ({ ...f, street: e.target.value }))} required />
              <Label>City</Label>
              <Input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} required />
              <Label>State</Label>
              <Input value={editForm.state} onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))} required />
              <Label>Pincode</Label>
              <Input value={editForm.pincode} onChange={e => setEditForm(f => ({ ...f, pincode: e.target.value }))} required />
              <DialogFooter>
                <Button onClick={() => setEditModalOpen(false)} type="button" variant="secondary">Close</Button>
                <Button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
              </DialogFooter>
            </form>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>
      {/* View Customer Modal (read-only) */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer ? (
            <div className="space-y-2">
              <div><b>Owner Name:</b> {selectedCustomer.ownerName}</div>
              <div><b>Business Name:</b> {selectedCustomer.businessName}</div>
              <div><b>Business Type:</b> {selectedCustomer.businessType}</div>
              <div><b>GST Number:</b> {selectedCustomer.gstNumber}</div>
              <div><b>Business Description:</b> {selectedCustomer.businessDescription}</div>
              <div><b>Email:</b> {selectedCustomer.email}</div>
              <div><b>Phone:</b> {selectedCustomer.phone}</div>
              <div><b>Street:</b> {selectedCustomer.address?.street}</div>
              <div><b>City:</b> {selectedCustomer.address?.city}</div>
              <div><b>State:</b> {selectedCustomer.address?.state}</div>
              <div><b>Pincode:</b> {selectedCustomer.address?.pincode}</div>
              {/* Add more fields as needed */}
            </div>
          ) : (
            <div>Loading...</div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewModalOpen(false)} type="button" variant="secondary">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
