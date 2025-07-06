import { Award, Globe, Shield, Truck, Users, Zap } from "lucide-react"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
	{ label: "Years in Business", value: "15+" },
	{ label: "Happy Retailers", value: "2,500+" },
	{ label: "Products Available", value: "10,000+" },
	{ label: "Cities Served", value: "50+" },
]

const values = [
	{
		icon: Shield,
		title: "Quality Assurance",
		description: "Every product undergoes strict quality checks before reaching our customers.",
	},
	{
		icon: Truck,
		title: "Reliable Delivery",
		description: "On-time delivery with our extensive logistics network across the region.",
	},
	{
		icon: Users,
		title: "Customer First",
		description: "Dedicated support team to help retailers grow their business successfully.",
	},
	{
		icon: Zap,
		title: "Innovation",
		description: "Constantly improving our processes and technology for better service.",
	},
]

const team = [
	{
		name: "Rajesh Nayak",
		role: "Founder & CEO",
		image: "/placeholder.svg?height=200&width=200",
		description: "15+ years of experience in wholesale distribution and retail partnerships.",
	},
	{
		name: "Priya Sharma",
		role: "Operations Director",
		image: "/placeholder.svg?height=200&width=200",
		description: "Expert in supply chain management and logistics optimization.",
	},
	{
		name: "Amit Kumar",
		role: "Business Development",
		image: "/placeholder.svg?height=200&width=200",
		description: "Specializes in building strong relationships with retail partners.",
	},
]

export default function AboutPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			{/* Hero Section */}
			<section className="text-center mb-16">
				<h1 className="text-4xl font-bold mb-6">About Nayak Enterprises</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
					For over 15 years, we've been the trusted wholesale partner for retailers across the region, providing quality
					products at competitive prices with exceptional service.
				</p>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{stats.map((stat, index) => (
						<div key={index} className="text-center">
							<div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</div>
					))}
				</div>
			</section>

			{/* Our Story */}
			<section className="mb-16">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl font-bold mb-6">Our Story</h2>
						<div className="space-y-4 text-muted-foreground">
							<p>
								Founded in 2009 by Rajesh Nayak, Nayak Enterprises started as a small wholesale business with a simple
								mission: to help local retailers succeed by providing them with quality products at fair prices.
							</p>
							<p>
								What began as a single warehouse operation has grown into a comprehensive distribution network serving
								over 2,500 retailers across 50+ cities. Our success is built on strong relationships, reliable service,
								and an unwavering commitment to quality.
							</p>
							<p>
								Today, we continue to evolve with technology while maintaining the personal touch that has made us a
								trusted partner for retailers of all sizes.
							</p>
						</div>
					</div>
					<div className="relative">
						<Image
							src="/placeholder.svg?height=400&width=600"
							alt="Nayak Enterprises warehouse"
							width={600}
							height={400}
							className="rounded-lg shadow-lg"
						/>
					</div>
				</div>
			</section>

			{/* Our Values */}
			<section className="mb-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Our Values</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						These core values guide everything we do and shape our relationships with partners and customers.
					</p>
				</div>
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{values.map((value, index) => {
						const IconComponent = value.icon
						return (
							<Card key={index} className="text-center">
								<CardHeader>
									<div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
										<IconComponent className="h-6 w-6 text-blue-600" />
									</div>
									<CardTitle className="text-lg">{value.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{value.description}</CardDescription>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</section>

			{/* Leadership Team */}
			<section className="mb-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Meet the experienced professionals who lead our company and drive our mission forward.
					</p>
				</div>
				<div className="grid md:grid-cols-3 gap-8">
					{team.map((member, index) => (
						<Card key={index} className="text-center">
							<CardContent className="pt-6">
								<Image
									src={member.image || "/placeholder.svg"}
									alt={member.name}
									width={200}
									height={200}
									className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
								/>
								<h3 className="text-xl font-semibold mb-2">{member.name}</h3>
								<Badge variant="secondary" className="mb-4">
									{member.role}
								</Badge>
								<p className="text-muted-foreground text-sm">{member.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Certifications */}
			<section className="mb-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Certifications & Awards</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Our commitment to excellence has been recognized by industry bodies and customers alike.
					</p>
				</div>
				<div className="grid md:grid-cols-3 gap-6">
					<Card className="text-center">
						<CardContent className="pt-6">
							<Award className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
							<h3 className="font-semibold mb-2">ISO 9001:2015 Certified</h3>
							<p className="text-sm text-muted-foreground">Quality Management System</p>
						</CardContent>
					</Card>
					<Card className="text-center">
						<CardContent className="pt-6">
							<Globe className="h-12 w-12 mx-auto text-green-600 mb-4" />
							<h3 className="font-semibold mb-2">Best Distributor Award</h3>
							<p className="text-sm text-muted-foreground">Regional Trade Association 2023</p>
						</CardContent>
					</Card>
					<Card className="text-center">
						<CardContent className="pt-6">
							<Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
							<h3 className="font-semibold mb-2">Customer Choice Award</h3>
							<p className="text-sm text-muted-foreground">Retail Partners Survey 2023</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Mission Statement */}
			<section className="bg-slate-50 rounded-lg p-8 text-center">
				<h2 className="text-2xl font-bold mb-4">Our Mission</h2>
				<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
					"To empower retailers with quality products, competitive pricing, and exceptional service, helping them build
					successful businesses while contributing to the growth of local communities."
				</p>
			</section>
		</div>
	)
}
