"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"
import { useAdmin } from "@/lib/admin"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import ThemeToggle from "@/components/ThemeToggle"
import { useTheme } from "next-themes"

function ProductsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      {/* Filters */}
      <Skeleton className="h-16 w-full" />
      {/* Table */}
      <div className="rounded-lg border">
        <div className="p-6">
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getProducts, addProduct, updateProduct, deleteProduct } = useAdmin()

  // Modal state for add/edit
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add") // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState(null)
  // Update formData initial state and handlers
  const initialFormData = {
    name: "",
    sku: "",
    category: "",
    price: "",
    stockQuantity: "",
    description: "",
    minOrderQuantity: "",
    maxOrderQuantity: "",
    image: ""
  };
  const [formData, setFormData] = useState(initialFormData)

  // Add state for view modal
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewProduct, setViewProduct] = useState(null)

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (err) {
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setModalMode("add")
    setFormData(initialFormData)
    setShowModal(true)
  }

  const handleEditClick = (product) => {
    setModalMode("edit")
    setCurrentProduct(product)
    setFormData({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      price: product.price || "",
      stockQuantity: product.stockQuantity || "",
      description: product.description || "",
      minOrderQuantity: product.minOrderQuantity || "",
      maxOrderQuantity: product.maxOrderQuantity || "",
      image: product.images?.[0]?.url || ""
    })
    setShowModal(true)
  }

  const handleDeleteClick = async (product) => {
    if (window.confirm(`Are you sure you want to delete product '${product.name}'?`)) {
      setLoading(true)
      try {
        await deleteProduct(product._id)
        await fetchProducts()
      } catch (err) {
        setError("Failed to delete product")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleViewClick = (product) => {
    setViewProduct(product)
    setShowViewModal(true)
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Validate required fields
      if (!formData.name || !formData.sku || !formData.category || !formData.price || 
          !formData.stockQuantity || !formData.description || !formData.minOrderQuantity || 
          !formData.maxOrderQuantity) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Build the product object as backend expects
      const productPayload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        description: formData.description.trim(),
        minOrderQuantity: Number(formData.minOrderQuantity),
        maxOrderQuantity: Number(formData.maxOrderQuantity),
        images: formData.image ? [{ url: formData.image.trim(), isPrimary: true }] : [],
      }
      console.log('Submitting product payload:', productPayload);
      if (modalMode === "add") {
        await addProduct(productPayload)
      } else if (modalMode === "edit" && currentProduct) {
        await updateProduct(currentProduct._id, productPayload)
      }
      setShowModal(false)
      await fetchProducts()
    } catch (err) {
      console.error('Error saving product:', err);
      setError("Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
    
    // Calculate status based on stock quantity
    let productStatus = "Active"
    if (product.stockQuantity === 0) {
      productStatus = "Out of Stock"
    } else if (product.stockQuantity <= 10) {
      productStatus = "Low Stock"
    }
    
    const matchesStatus = statusFilter === "All" || productStatus === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (loading) {
    return <ProductsSkeleton />
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and catalog</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Food & Grains">Food & Grains</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
                <SelectItem value="Household">Household</SelectItem>
                <SelectItem value="Beverages">Beverages</SelectItem>
                <SelectItem value="Personal Care">Personal Care</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>A list of all products in your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stockQuantity === 0
                          ? "destructive"
                          : product.stockQuantity <= 10
                            ? "secondary"
                            : "default"
                      }
                    >
                      {product.stockQuantity === 0 
                        ? "Out of Stock" 
                        : product.stockQuantity <= 10 
                          ? "Low Stock" 
                          : "Active"
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewClick(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(product)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Modal for Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 w-full p-4">
          <form onSubmit={handleModalSubmit} className={`bg-neutral-900 p-4 md:p-6 rounded shadow-md space-y-4 border border-neutral-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${resolvedTheme === 'dark' ? 'text-white' : 'text-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">{modalMode === "add" ? "Add Product" : "Edit Product"}</h2>
              <ThemeToggle />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32">Product Name *</label>
              <input className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" placeholder="Enter product name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32">SKU *</label>
              <input className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" placeholder="Enter SKU code" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} required />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32">Category *</label>
              <select className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                <option value="">Select Category</option>
                <option value="Food & Grains">Food & Grains</option>
                <option value="Household">Household</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32">Price (₹) *</label>
              <input className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" placeholder="Enter price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32">Stock Quantity *</label>
              <input className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" placeholder="Enter stock quantity" type="number" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} required />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32 md:mt-2">Description *</label>
              <textarea className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" placeholder="Enter product description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32">Min Order Quantity *</label>
              <input className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" placeholder="Enter minimum order quantity" type="number" value={formData.minOrderQuantity} onChange={e => setFormData({ ...formData, minOrderQuantity: e.target.value })} required />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32">Max Order Quantity *</label>
              <input className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" placeholder="Enter maximum order quantity" type="number" value={formData.maxOrderQuantity} onChange={e => setFormData({ ...formData, maxOrderQuantity: e.target.value })} required />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-white md:w-32">Image URL</label>
              <input className="w-full md:flex-1 border p-2 rounded bg-neutral-800 text-white placeholder-gray-300" placeholder="Enter image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">{modalMode === "add" ? "Add" : "Save"}</Button>
            </div>
          </form>
        </div>
      )}
      {/* Modal for View Product */}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-neutral-900 p-6 rounded shadow-md min-w-[320px] space-y-4 border border-neutral-700 text-white">
            <h2 className="text-xl font-bold mb-2">Product Details</h2>
            <div className="flex flex-col items-center">
              <img
                src={viewProduct.images?.[0]?.url }
                alt={viewProduct.name}
                width={100}
                height={100}
                className="rounded-md object-cover mb-2"

              />
              <p className="font-bold text-lg text-white">{viewProduct.name}</p>
              <p><span className="font-semibold">SKU:</span> {viewProduct.sku}</p>
              <p><span className="font-semibold">Category:</span> {viewProduct.category}</p>
              <p><span className="font-semibold">Price:</span> ₹{viewProduct.price}</p>
              <p><span className="font-semibold">Stock:</span> {viewProduct.stockQuantity}</p>
              <p><span className="font-semibold">Status:</span> {viewProduct.isActive ? "Active" : viewProduct.stockQuantity <= 10 ? "Low Stock" : "Out of Stock"}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
              <Button type="button" variant="default" onClick={() => { setShowViewModal(false); handleEditClick(viewProduct); }}>Update</Button>
              <Button type="button" variant="destructive" onClick={() => { setShowViewModal(false); handleDeleteClick(viewProduct); }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
