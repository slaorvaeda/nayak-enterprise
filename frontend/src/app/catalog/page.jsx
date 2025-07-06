"use client"

import { Grid, List, Search, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/utils"

export default function CatalogPage() {
	const [viewMode, setViewMode] = useState("grid")
	const [selectedCategory, setSelectedCategory] = useState("All")
	const [sortBy, setSortBy] = useState("name")
	const [searchQuery, setSearchQuery] = useState("")
	const [products, setProducts] = useState([])
	const [categories, setCategories] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	const searchParams = useSearchParams()
	const { addItem } = useCart()
	const { toast } = useToast()

	// Load products and categories
	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true)
				const [productsResponse, categoriesResponse] = await Promise.all([
					api.products.getAll(),
					api.products.getCategories()
				])
				
				setProducts(productsResponse.data.products || [])
				setCategories(['All', ...(categoriesResponse.data.categories || [])])
			} catch (error) {
				console.error('Failed to load catalog data:', error)
				setError('Failed to load products. Please try again.')
			} finally {
				setIsLoading(false)
			}
		}

		loadData()
	}, [])

	// Handle URL search parameters
	useEffect(() => {
		const urlSearch = searchParams.get("search")
		const urlCategory = searchParams.get("category")

		if (urlSearch) {
			setSearchQuery(urlSearch)
		}
		if (urlCategory) {
			setSelectedCategory(urlCategory)
		}
	}, [searchParams])

	const handleAddToCart = async (product) => {
		if (!product.inStock) return

		try {
			await addItem(product)
			toast({
				title: "Added to cart",
				description: `${product.name} has been added to your cart.`,
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to add item to cart. Please try again.",
				variant: "destructive",
			})
		}
	}

	const filteredProducts = products.filter((product) => {
		const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
		const matchesSearch =
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.description.toLowerCase().includes(searchQuery.toLowerCase())
		return matchesCategory && matchesSearch
	})

	const sortedProducts = [...filteredProducts].sort((a, b) => {
		switch (sortBy) {
			case "price-low":
				return a.price - b.price
			case "price-high":
				return b.price - a.price
			case "rating":
				return b.rating - a.rating
			default:
				return a.name.localeCompare(b.name)
		}
	})

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Loading products...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p className="text-red-600">{error}</p>
					<Button onClick={() => window.location.reload()} className="mt-4">
						Try Again
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
				<p className="text-muted-foreground">
					Browse our extensive collection of wholesale products for your retail business.
				</p>
			</div>

			{/* Filters and Search */}
			<div className="flex flex-col lg:flex-row gap-4 mb-8">
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search products..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>
				<div className="flex gap-4">
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((category) => (
								<SelectItem key={category} value={category}>
									{category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="name">Name</SelectItem>
							<SelectItem value="price-low">Price: Low to High</SelectItem>
							<SelectItem value="price-high">Price: High to Low</SelectItem>
							<SelectItem value="rating">Rating</SelectItem>
						</SelectContent>
					</Select>
					<div className="flex border rounded-md">
						<Button
							variant={viewMode === "grid" ? "default" : "ghost"}
							size="sm"
							onClick={() => setViewMode("grid")}
						>
							<Grid className="h-4 w-4" />
						</Button>
						<Button
							variant={viewMode === "list" ? "default" : "ghost"}
							size="sm"
							onClick={() => setViewMode("list")}
						>
							<List className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Products Grid/List */}
			<div
				className={
					viewMode === "grid"
						? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						: "space-y-4"
				}
			>
				{sortedProducts.map((product) => (
					<Card key={product.id} className={viewMode === "list" ? "flex" : ""}>
						<div className={viewMode === "list" ? "w-48 flex-shrink-0" : ""}>
							<div className="relative">
								<Image
									src={product.image || "/placeholder.svg"}
									alt={product.name}
									width={300}
									height={300}
									className={`object-cover ${
										viewMode === "list" ? "h-48 w-48" : "h-64 w-full"
									} rounded-t-lg`}
								/>
								{!product.inStock && (
									<Badge variant="destructive" className="absolute top-2 right-2">
										Out of Stock
									</Badge>
								)}
								{product.originalPrice > product.price && (
									<Badge className="absolute top-2 left-2 bg-green-600">
										Save ₹{product.originalPrice - product.price}
									</Badge>
								)}
							</div>
						</div>
						<div className={viewMode === "list" ? "flex-1" : ""}>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle className="text-lg">{product.name}</CardTitle>
										<CardDescription>{product.category}</CardDescription>
									</div>
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										<span className="text-sm">{product.rating}</span>
										<span className="text-xs text-muted-foreground">
											({product.reviews})
										</span>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-4">
									{product.description}
								</p>
								<div className="flex items-center gap-2 mb-2">
									<span className="text-2xl font-bold">₹{product.price}</span>
									{product.originalPrice > product.price && (
										<span className="text-sm text-muted-foreground line-through">
											₹{product.originalPrice}
										</span>
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									Minimum Order: {product.minOrder} units
								</p>
							</CardContent>
							<CardFooter className="flex gap-2">
								<Button className="flex-1" disabled={!product.inStock} asChild>
									<Link href={`/product/${product.id}`}>
										{product.inStock ? "View Details" : "Out of Stock"}
									</Link>
								</Button>
								<Button
									variant="outline"
									disabled={!product.inStock}
									onClick={() => handleAddToCart(product)}
								>
									Add to Cart
								</Button>
							</CardFooter>
						</div>
					</Card>
				))}
			</div>

			{sortedProducts.length === 0 && (
				<div className="text-center py-12">
					<p className="text-muted-foreground">
						No products found matching your criteria.
					</p>
				</div>
			)}
		</div>
	)
}
