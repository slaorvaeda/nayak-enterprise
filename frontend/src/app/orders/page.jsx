"use client"

import { Calendar, Package, Search, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock orders data
const orders = [
	{
		id: "ORD-2024-001",
		date: "2024-01-15",
		status: "Delivered",
		items: 12,
		total: 15750,
		trackingNumber: "TRK123456789",
		estimatedDelivery: "2024-01-18",
		products: [
			{ name: "Premium Rice (25kg)", quantity: 10, price: 1250 },
			{ name: "Cooking Oil (15L)", quantity: 2, price: 2100 },
		],
	},
	{
		id: "ORD-2024-002",
		date: "2024-01-10",
		status: "In Transit",
		items: 8,
		total: 9200,
		trackingNumber: "TRK987654321",
		estimatedDelivery: "2024-01-16",
		products: [
			{ name: "Detergent Powder (5kg)", quantity: 8, price: 450 },
			{ name: "Tea Packets (250g x 20)", quantity: 2, price: 1800 },
		],
	},
	{
		id: "ORD-2024-003",
		date: "2024-01-05",
		status: "Processing",
		items: 15,
		total: 22100,
		trackingNumber: null,
		estimatedDelivery: "2024-01-12",
		products: [
			{ name: "Premium Rice (25kg)", quantity: 15, price: 1250 },
			{ name: "Biscuits Assorted (24 packs)", quantity: 5, price: 960 },
		],
	},
	{
		id: "ORD-2024-004",
		date: "2023-12-28",
		status: "Cancelled",
		items: 6,
		total: 5400,
		trackingNumber: null,
		estimatedDelivery: null,
		products: [{ name: "Shampoo Bottles (500ml x 12)", quantity: 6, price: 1440 }],
	},
]

const statusConfig = {
	Processing: { icon: Clock, color: "bg-yellow-100 text-yellow-800", bgColor: "bg-yellow-50" },
	"In Transit": { icon: Truck, color: "bg-blue-100 text-blue-800", bgColor: "bg-blue-50" },
	Delivered: { icon: CheckCircle, color: "bg-green-100 text-green-800", bgColor: "bg-green-50" },
	Cancelled: { icon: XCircle, color: "bg-red-100 text-red-800", bgColor: "bg-red-50" },
}

export default function OrdersPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [statusFilter, setStatusFilter] = useState("All")
	const [selectedOrder, setSelectedOrder] = useState(null)

	const filteredOrders = orders.filter((order) => {
		const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesStatus = statusFilter === "All" || order.status === statusFilter
		return matchesSearch && matchesStatus
	})

	return (
		<ProtectedRoute requireAuth={true}>
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-4">Order History</h1>
					<p className="text-muted-foreground">Track and manage all your wholesale orders in one place.</p>
				</div>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search orders by ID..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All Orders</SelectItem>
							<SelectItem value="Processing">Processing</SelectItem>
							<SelectItem value="In Transit">In Transit</SelectItem>
							<SelectItem value="Delivered">Delivered</SelectItem>
							<SelectItem value="Cancelled">Cancelled</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Orders List */}
				<div className="space-y-4">
					{filteredOrders.map((order) => {
						const statusKey = order.status
						const StatusIcon = statusConfig[statusKey].icon
						const isExpanded = selectedOrder === order.id

						return (
							<Card key={order.id} className="overflow-hidden">
								<CardHeader
									className="cursor-pointer hover:bg-gray-50"
									onClick={() => setSelectedOrder(isExpanded ? null : order.id)}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className={`p-2 rounded-full ${statusConfig[statusKey].bgColor}`}>
												<StatusIcon className={`h-5 w-5 ${statusConfig[statusKey].color.split(" ")[1]}`} />
											</div>
											<div>
												<CardTitle className="text-lg">{order.id}</CardTitle>
												<CardDescription className="flex items-center gap-4">
													<span className="flex items-center gap-1">
														<Calendar className="h-4 w-4" />
														{order.date}
													</span>
													<span className="flex items-center gap-1">
														<Package className="h-4 w-4" />
														{order.items} items
													</span>
												</CardDescription>
											</div>
										</div>
										<div className="text-right">
											<p className="text-xl font-bold">₹{order.total.toLocaleString()}</p>
											<Badge className={statusConfig[statusKey].color}>{order.status}</Badge>
										</div>
									</div>
								</CardHeader>

								{isExpanded && (
									<CardContent className="pt-0">
										<Separator className="mb-4" />

										{/* Order Details */}
										<div className="grid md:grid-cols-2 gap-6">
											<div>
												<h4 className="font-semibold mb-3">Order Items</h4>
												<div className="space-y-2">
													{order.products.map((product, index) => (
														<div
															key={index}
															className="flex justify-between items-center py-2 border-b last:border-b-0"
														>
															<div>
																<p className="font-medium">{product.name}</p>
																<p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
															</div>
															<p className="font-medium">₹{(product.price * product.quantity).toLocaleString()}</p>
														</div>
													))}
												</div>
											</div>

											<div>
												<h4 className="font-semibold mb-3">Shipping Information</h4>
												<div className="space-y-2">
													{order.trackingNumber && (
														<div>
															<p className="text-sm text-muted-foreground">Tracking Number</p>
															<p className="font-medium">{order.trackingNumber}</p>
														</div>
													)}
													{order.estimatedDelivery && (
														<div>
															<p className="text-sm text-muted-foreground">Estimated Delivery</p>
															<p className="font-medium">{order.estimatedDelivery}</p>
														</div>
													)}
												</div>

												<div className="mt-4 space-y-2">
													{order.status === "In Transit" && (
														<Button variant="outline" className="w-full bg-transparent">
															Track Package
														</Button>
													)}
													{order.status === "Delivered" && (
														<Button variant="outline" className="w-full bg-transparent">
															Reorder Items
														</Button>
													)}
													<Button variant="ghost" className="w-full">
														Download Invoice
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								)}
							</Card>
						)
					})}
				</div>

				{filteredOrders.length === 0 && (
					<div className="text-center py-12">
						<Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">No orders found</h3>
						<p className="text-muted-foreground">
							{searchQuery || statusFilter !== "All"
								? "Try adjusting your search or filter criteria."
								: "You haven't placed any orders yet."}
						</p>
					</div>
				)}
			</div>
		</div>
		</ProtectedRoute>
	)
}
