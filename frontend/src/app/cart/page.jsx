"use client"

import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeCartItem, updateCartItemQuantity, getTotalPrice, clearError } from '@/store/cartSlice';
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/lib/auth';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const status = useSelector((state) => state.cart.status);
  const error = useSelector((state) => state.cart.error);
  const subtotal = useSelector(getTotalPrice);
  const [promoCode, setPromoCode] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const originalTotal = items.reduce(
    (sum, item) => sum + (item.originalPrice || item.unitPrice) * item.quantity,
    0
  )
  const savings = originalTotal - subtotal
  const shipping = subtotal > 10000 ? 0 : 500
  const total = subtotal + shipping

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      // console.log('=== UPDATE DEBUG ===');
      // console.log('Original id:', id);
      // console.log('id type:', typeof id);
      // console.log('id._id:', id._id);
      // console.log('id.toString():', id.toString());
      
      // Extract the actual product ID whether it's an ObjectId or populated product object
      const productId = id._id ? id._id.toString() : id.toString();
      // console.log('Final productId:', productId);
      // console.log('==================');
      
      await dispatch(updateCartItemQuantity({ productId, quantity }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (id, name) => {
    try {
      // Extract the actual product ID whether it's an ObjectId or populated product object
      const productId = id._id ? id._id.toString() : id.toString();
      
      await dispatch(removeCartItem(productId));
      toast({
        title: "Item removed",
        description: `${name} has been removed from your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    router.push("/checkout")
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Please log in to view your cart.</h1>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">You must be signed in to add or view cart items.</p>
        <Button asChild>
          <a href="/login">Go to Login</a>
        </Button>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Add some products to your cart to get started with your wholesale order.
          </p>
          <Button asChild>
            <Link href="/catalog">Browse Catalog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.toString()}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Image
                      src={(item.image || "/placeholder.svg").trimEnd()}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{item.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-lg sm:text-xl font-bold">₹{item.unitPrice}</span>
                        {item.originalPrice > item.unitPrice && (
                          <span className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</span>
                        )}
                        {item.originalPrice > item.unitPrice && (
                          <Badge className="bg-green-600 text-xs w-fit">Save ₹{item.originalPrice - item.unitPrice}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: {item.minOrderQuantity} • Max: {item.maxOrderQuantity} units
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= item.minOrderQuantity}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                          disabled={item.quantity >= item.maxOrderQuantity}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product, item.name)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Savings</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Promo Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" className="sm:w-auto">Apply</Button>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
