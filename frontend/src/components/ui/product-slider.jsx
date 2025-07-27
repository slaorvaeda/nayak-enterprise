'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { api } from "@/lib/utils"

export function ProductSlider() {
	const scrollRef = useRef(null)
	const [products, setProducts] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	// Load featured products
	useEffect(() => {
		const loadFeaturedProducts = async () => {
			try {
				setIsLoading(true)
				const response = await api.products.getFeatured(8)
				setProducts(response.data.products || [])
			} catch (error) {
				console.error('Failed to load featured products:', error)
				// Fallback to demo products if API fails
				setProducts([
					{
						name: "Premium Rice Bag",
						image: "/placeholder.jpg",
						description: "High quality rice for your store.",
					},
					{
						name: "Cooking Oil 5L",
						image: "/placeholder.jpg",
						description: "Trusted brand, best for bulk purchase.",
					},
					{
						name: "Detergent Powder",
						image: "/placeholder.jpg",
						description: "Top-selling cleaning product.",
					},
					{
						name: "Packaged Snacks",
						image: "/placeholder.jpg",
						description: "Popular snacks for all ages.",
					},
					{
						name: "Soft Drinks Crate",
						image: "/placeholder.jpg",
						description: "Assorted beverages for your customers.",
					},
				])
			} finally {
				setIsLoading(false)
			}
		}

		loadFeaturedProducts()
	}, [])

	const scroll = (dir) => {
		if (scrollRef.current) {
			const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current
			let next = dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
			// Loop to start if at end
			if (dir === "right" && next + clientWidth >= scrollWidth) next = 0
			if (dir === "left" && next < 0) next = scrollWidth - clientWidth
			scrollRef.current.scrollTo({
				left: next,
				behavior: "smooth",
			})
		}
	}

	// Auto-slide effect
	useEffect(() => {
		const interval = setInterval(() => {
			scroll("right")
		}, 3500) // Slide every 3.5 seconds
		return () => clearInterval(interval)
	}, [])

	if (isLoading) {
		return (
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-bold">Featured Products</h2>
					</div>
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className="py-16 bg-white">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-2xl font-bold">Featured Products</h2>
					<div className="flex gap-2">
						<button
							aria-label="Scroll left"
							className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"
							onClick={() => scroll("left")}
							type="button"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<button
							aria-label="Scroll right"
							className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"
							onClick={() => scroll("right")}
							type="button"
						>
							<ArrowRight className="h-5 w-5" />
						</button>
					</div>
				</div>
				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
					style={{ scrollSnapType: "x mandatory" }}
				>
					{products.map((product, idx) => (
						<Card
							key={product._id || product.name + idx}
							className="min-w-[260px] max-w-xs flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-200"
							style={{ scrollSnapAlign: "start" }}
						>
							<CardHeader className="flex flex-col items-center justify-center p-4 pb-2">
								<div className="w-full flex items-center justify-center aspect-[4/3] bg-slate-100 rounded-md overflow-hidden mb-2">
									<Image
										src={product.primaryImage || "/placeholder.jpg"}
										alt={product.name}
										width={220}
										height={165}
										className="object-contain w-full h-full max-h-[165px] max-w-[220px]"
									/>
								</div>
								<CardTitle className="text-lg font-semibold text-center mt-1 mb-0.5 leading-tight line-clamp-2">
									{product.name}
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0 pb-4 px-4">
								<CardDescription className="text-center text-slate-500 text-sm line-clamp-2 min-h-[2.5em]">
									{product.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
