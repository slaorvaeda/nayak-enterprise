"use client"

import { useState } from "react"
import { ArrowRight, Package, ShoppingCart, Users, BarChart3, Eye, Settings } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const demoFeatures = [
	{
		title: "Product Catalog",
		description:
			"Browse our extensive wholesale product catalog with advanced filtering and search",
		icon: Package,
		href: "/catalog",
		badge: "856 Products",
		color: "bg-blue-50 text-blue-600",
	},
	{
		title: "Shopping Cart",
		description:
			"Add products to cart with bulk quantity management and pricing calculations",
		icon: ShoppingCart,
		href: "/cart",
		badge: "Bulk Orders",
		color: "bg-green-50 text-green-600",
	},
	{
		title: "User Profile",
		description:
			"Manage business information, view order history, and track loyalty points",
		icon: Users,
		href: "/profile",
		badge: "B2B Focused",
		color: "bg-purple-50 text-purple-600",
	},
	{
		title: "Admin Dashboard",
		description:
			"Complete admin panel with analytics, order management, and customer insights",
		icon: BarChart3,
		href: "/admin",
		badge: "Role-Based",
		color: "bg-orange-50 text-orange-600",
	},
]

const demoAccounts = [
	{
		type: "Customer Account",
		email: "demo@customer.com",
		password: "demo123",
		description:
			"Experience the customer journey - browse products, place orders, manage profile",
		features: [
			"Product Browsing",
			"Cart Management",
			"Order Tracking",
			"Profile Management",
		],
	},
	{
		type: "Admin Account",
		email: "admin@nayakenterprises.com",
		password: "admin123",
		description:
			"Full admin access - manage products, orders, customers, and view analytics",
		features: [
			"Product Management",
			"Order Processing",
			"Customer Management",
			"Analytics Dashboard",
		],
	},
	{
		type: "Manager Account",
		email: "manager@nayakenterprises.com",
		password: "manager123",
		description:
			"Limited admin access - manage products and orders with restricted permissions",
		features: [
			"Product Management",
			"Order Management",
			"Customer Viewing",
			"Basic Analytics",
		],
	},
]

const screenshots = [
	{
		title: "Homepage",
		description:
			"Professional landing page with company information and call-to-actions",
		image: "/placeholder.svg?height=300&width=500",
	},
	{
		title: "Product Catalog",
		description:
			"Advanced product browsing with filters, search, and bulk pricing",
		image: "/placeholder.svg?height=300&width=500",
	},
	{
		title: "Admin Dashboard",
		description:
			"Comprehensive admin panel with real-time analytics and management tools",
		image: "/placeholder.svg?height=300&width=500",
	},
	{
		title: "Order Management",
		description:
			"Complete order tracking and management system for both customers and admins",
		image: "/placeholder.svg?height=300&width=500",
	},
]

export default function DemoPage() {
	const [selectedTab, setSelectedTab] = useState("features")

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-4">Nayak Enterprises Demo</h1>
					<p className="text-xl text-muted-foreground mb-8">
						Explore our complete wholesale e-commerce platform with live demo
						accounts and interactive features
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" asChild>
							<Link href="/catalog">
								<Eye className="mr-2 h-4 w-4" />
								Browse Live Catalog
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/admin/login">
								<Settings className="mr-2 h-4 w-4" />
								Try Admin Panel
							</Link>
						</Button>
					</div>
				</div>

				{/* Demo Tabs */}
				<Tabs
					value={selectedTab}
					onValueChange={setSelectedTab}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="features">Features</TabsTrigger>
						<TabsTrigger value="accounts">Demo Accounts</TabsTrigger>
						<TabsTrigger value="screenshots">Screenshots</TabsTrigger>
						<TabsTrigger value="technical">Technical</TabsTrigger>
					</TabsList>

					<TabsContent value="features" className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							{demoFeatures.map((feature) => {
								const IconComponent = feature.icon
								return (
									<Card
										key={feature.title}
										className="hover:shadow-lg transition-shadow"
									>
										<CardHeader>
											<div className="flex items-center justify-between">
												<div
													className={`p-2 rounded-lg ${feature.color}`}
												>
													<IconComponent className="h-6 w-6" />
												</div>
												<Badge variant="secondary">
													{feature.badge}
												</Badge>
											</div>
											<CardTitle>{feature.title}</CardTitle>
											<CardDescription>
												{feature.description}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Button asChild className="w-full">
												<Link href={feature.href}>
													Explore Feature{" "}
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</CardContent>
									</Card>
								)
							})}
						</div>
					</TabsContent>

					<TabsContent value="accounts" className="space-y-6">
						<div className="grid gap-6">
							{demoAccounts.map((account) => (
								<Card key={account.type}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle>{account.type}</CardTitle>
											<Badge>{account.type.split(" ")[0]}</Badge>
										</div>
										<CardDescription>
											{account.description}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid md:grid-cols-2 gap-6">
											<div>
												<h4 className="font-medium mb-2">
													Login Credentials:
												</h4>
												<div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-1">
													<p className="text-sm">
														<strong>Email:</strong> {account.email}
													</p>
													<p className="text-sm">
														<strong>Password:</strong>{" "}
														{account.password}
													</p>
												</div>
											</div>
											<div>
												<h4 className="font-medium mb-2">
													Available Features:
												</h4>
												<div className="flex flex-wrap gap-2">
													{account.features.map((feature) => (
														<Badge key={feature} variant="outline">
															{feature}
														</Badge>
													))}
												</div>
											</div>
										</div>
										<div className="mt-4">
											<Button asChild>
												<Link
													href={
														account.type.includes("Admin")
															? "/admin/login"
															: "/login"
													}
												>
													Try {account.type}{" "}
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="screenshots" className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							{screenshots.map((screenshot) => (
								<Card key={screenshot.title}>
									<CardContent className="p-0">
										<img
											src={screenshot.image || "/placeholder.svg"}
											alt={screenshot.title}
											className="w-full h-64 object-cover rounded-t-lg"
										/>
										<div className="p-6">
											<h3 className="font-semibold mb-2">
												{screenshot.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												{screenshot.description}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="technical" className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Frontend Technologies</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<Badge variant="outline">Next.js 14</Badge>
										<Badge variant="outline">React 18</Badge>
										<Badge variant="outline">TypeScript</Badge>
										<Badge variant="outline">Tailwind CSS</Badge>
										<Badge variant="outline">shadcn/ui</Badge>
										<Badge variant="outline">Zustand</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Key Features</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<Badge variant="outline">Role-Based Auth</Badge>
										<Badge variant="outline">Shopping Cart</Badge>
										<Badge variant="outline">Admin Dashboard</Badge>
										<Badge variant="outline">Dark/Light Theme</Badge>
										<Badge variant="outline">Responsive Design</Badge>
										<Badge variant="outline">Search & Filters</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Backend Ready</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<Badge variant="outline">Node.js + Express</Badge>
										<Badge variant="outline">PostgreSQL</Badge>
										<Badge variant="outline">JWT Authentication</Badge>
										<Badge variant="outline">Docker Support</Badge>
										<Badge variant="outline">API Documentation</Badge>
										<Badge variant="outline">Automated Deployment</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Production Features</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<Badge variant="outline">SSL Security</Badge>
										<Badge variant="outline">Rate Limiting</Badge>
										<Badge variant="outline">Error Handling</Badge>
										<Badge variant="outline">Logging</Badge>
										<Badge variant="outline">Health Checks</Badge>
										<Badge variant="outline">Backup Scripts</Badge>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>

				{/* Quick Links */}
				<div className="mt-12 text-center">
					<h2 className="text-2xl font-bold mb-6">Quick Access</h2>
					<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
						<Button
							variant="outline"
							asChild
							className="h-16 bg-transparent"
						>
							<Link href="/">
								<div className="text-center">
									<div className="font-medium">Homepage</div>
									<div className="text-xs text-muted-foreground">
										Company Info
									</div>
								</div>
							</Link>
						</Button>
						<Button
							variant="outline"
							asChild
							className="h-16 bg-transparent"
						>
							<Link href="/catalog">
								<div className="text-center">
									<div className="font-medium">Product Catalog</div>
									<div className="text-xs text-muted-foreground">
										Browse Products
									</div>
								</div>
							</Link>
						</Button>
						<Button
							variant="outline"
							asChild
							className="h-16 bg-transparent"
						>
							<Link href="/register">
								<div className="text-center">
									<div className="font-medium">Registration</div>
									<div className="text-xs text-muted-foreground">
										Become Partner
									</div>
								</div>
							</Link>
						</Button>
						<Button
							variant="outline"
							asChild
							className="h-16 bg-transparent"
						>
							<Link href="/admin/login">
								<div className="text-center">
									<div className="font-medium">Admin Panel</div>
									<div className="text-xs text-muted-foreground">
										Management
									</div>
								</div>
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

// No TypeScript-specific syntax found. All code is valid JavaScript.
// No corrections needed for JavaScript compliance.
