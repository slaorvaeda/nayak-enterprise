"use client"

import { Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addItemToCart } from "@/store/cartSlice"
import { api } from "@/lib/utils"
import { useAuth } from '@/lib/auth';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import React from "react"

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const items = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useAuth();

  // Await params using React.use
  const unwrappedParams = React.use(params)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await api.products.getById(unwrappedParams.id)
        const fetchedProduct = response.data.product
        setProduct(fetchedProduct)
        setQuantity(fetchedProduct.minOrderQuantity)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        // Handle not found or other errors
      } finally {
        setIsLoading(false)
      }
    }

    if (unwrappedParams.id) {
      fetchProduct()
    }
  }, [unwrappedParams.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const totalPrice = quantity * product.price
  const savings = quantity * (product.originalPrice - product.price)

  const incrementQuantity = () => {
    if (quantity < product.maxOrderQuantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > product.minOrderQuantity) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated || product.stockQuantity === 0) return;
    await dispatch(addItemToCart({ productId: product._id, quantity }));
    toast({
      title: "Added to cart",
      description: `${quantity} units of ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative">
            <Image
              src={(product.images[selectedImage]?.url || "/placeholder.svg").trimEnd()}
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
                  src={(image.url || "/placeholder.svg").trimEnd()}
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
                <span className="font-medium">{product.rating.average}</span>
              </div>
              <span className="text-muted-foreground">({product.rating.count} reviews)</span>
              <Badge variant={product.stockQuantity > 0 ? "default" : "destructive"}>
                {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
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
            <p className="text-sm text-muted-foreground">Price per unit • Minimum order: {product.minOrderQuantity} units</p>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Quantity (Min: {product.minOrderQuantity}, Max: {product.maxOrderQuantity})
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= product.minOrderQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-16 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.maxOrderQuantity}
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
            <Button size="lg" className="w-full" disabled={!isAuthenticated || product.stockQuantity === 0} onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
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
                {product.features?.map((feature, index) => (
                  <li key={index} className="text-sm">
                    {feature}
                  </li>
                )) || <li>No features listed.</li>}
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
                {product.specifications?.map((spec) => (
                  <div key={spec.name} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{spec.name}:</span>
                    <span>{spec.value}</span>
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
              <CardDescription>Based on {product.rating.count} reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(product.rating.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating.average} out of 5</span>
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
