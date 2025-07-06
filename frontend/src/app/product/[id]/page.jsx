"use client"

import { Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

// Mock product data - in real app, this would come from API based on params.id
const product = {
  id: 1,
  name: "Premium Rice (25kg)",
  category: "Food & Grains",
  price: 1250,
  originalPrice: 1400,
  images: [
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ],
  rating: 4.5,
  reviews: 128,
  inStock: true,
  minOrder: 10,
  maxOrder: 500,
  description:
    "High-quality basmati rice, perfect for retail stores. This premium grade rice is carefully selected and processed to ensure consistent quality and taste.",
  specifications: {
    Weight: "25kg per bag",
    Type: "Basmati Rice",
    Grade: "Premium",
    "Shelf Life": "12 months",
    Storage: "Cool, dry place",
    Origin: "India",
  },
  features: [
    "Premium quality basmati rice",
    "Long grain variety",
    "Aromatic and flavorful",
    "Perfect for retail packaging",
    "Bulk wholesale pricing",
    "Quality assured",
  ],
}

export default function ProductPage() {
  const [quantity, setQuantity] = useState(product.minOrder)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()
  const { toast } = useToast()

  const totalPrice = quantity * product.price
  const savings = quantity * (product.originalPrice - product.price)

  const incrementQuantity = () => {
    if (quantity < product.maxOrder) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > product.minOrder) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    if (!product.inStock) return

    // Add the specified quantity to cart
    for (let i = 0; i < Math.ceil(quantity / product.minOrder); i++) {
      const remainingQty = quantity - i * product.minOrder
      const qtyToAdd = Math.min(remainingQty, product.minOrder)

      if (qtyToAdd > 0) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          minOrder: product.minOrder,
          maxOrder: product.maxOrder,
          inStock: product.inStock,
        })
      }
    }

    toast({
      title: "Added to cart",
      description: `${quantity} units of ${product.name} added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? "border-primary" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
              <Badge variant={product.inStock ? "default" : "destructive"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
              {product.originalPrice > product.price && (
                <Badge className="bg-green-600">Save ₹{product.originalPrice - product.price}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Price per unit • Minimum order: {product.minOrder} units</p>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Quantity (Min: {product.minOrder}, Max: {product.maxOrder})
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= product.minOrder}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-16 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.maxOrder}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({quantity} units):</span>
                    <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You save:</span>
                      <span className="font-medium">₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button size="lg" className="w-full" disabled={!product.inStock} onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="w-full bg-transparent">
              Request Quote
            </Button>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Free delivery on orders above ₹10,000</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{product.description}</p>
              <h4 className="font-medium mb-2">Key Features:</h4>
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="specifications">
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>Based on {product.reviews} reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating} out of 5</span>
                </div>
                <p className="text-muted-foreground">Reviews from verified wholesale customers will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
