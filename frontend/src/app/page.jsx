"use client"

import { useEffect, useRef, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

import { ArrowRight, Package, Shield, Truck, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductSlider } from "@/components/ui/product-slider"
import { WorkWithBrands } from "@/components/ui/work-with-brands"

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true, 
    })
  }, [])

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const [isPointer, setIsPointer] = useState(true);

  useEffect(() => {
    // Detect if device supports pointer (not touch)
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsPointer(true);
    } else {
      setIsPointer(false);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!isPointer) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (!isPointer) return;
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-700 text-white pt-10  md:pt-0" data-aos="fade-in">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-up">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Nayak Enterprises</h1>
              <p className="text-xl mb-8 text-slate-200" data-aos="fade-up" >
                Your trusted wholesale partner for quality products. We supply retailers and shopkeepers with premium
                merchandise at competitive prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/catalog">
                    Browse Catalog <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-slate-900 bg-transparent"
                >
                  <Link href="/register">Become a Partner</Link>
                </Button>
              </div>
            </div>
            <div className="relative" data-aos="zoom-in">
              <div
                ref={imgRef}
                className="w-full max-w-[600px] h-auto mx-auto"
                style={{
                  perspective: "1000px",
                  display: "inline-block",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src="/hero.png?height=400&width=600"
                  alt="Warehouse and distribution"
                  width={600}
                  height={400}
                  className="md:relative md:top-20 rounded-lg object-contain drop-shadow-black drop-shadow-2xl w-full h-auto"
                  style={isPointer ? {
                    transform: `rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: tilt.x === 0 && tilt.y === 0 ? "transform 0.4s cubic-bezier(.03,.98,.52,.99)" : "none",
                  } : {}}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-4">Why Choose Nayak Enterprises?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide comprehensive wholesale solutions for retailers and shopkeepers across the region.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card data-aos="fade-up" data-aos-delay="100">
              <CardHeader className="text-center">
                <Package className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>Wide Product Range</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Extensive catalog of quality products across multiple categories for your retail needs.
                </CardDescription>
              </CardContent>
            </Card>
            <Card data-aos="fade-up" data-aos-delay="200">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <CardTitle>B2B Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Specialized service for retailers and shopkeepers with bulk pricing and trade terms.
                </CardDescription>
              </CardContent>
            </Card>
            <Card data-aos="fade-up" data-aos-delay="300">
              <CardHeader className="text-center">
                <Truck className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Reliable distribution network ensuring timely delivery to your store location.
                </CardDescription>
              </CardContent>
            </Card>
            <Card data-aos="fade-up" data-aos-delay="400">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <CardTitle>Quality Assured</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  All products are quality checked and come with our guarantee for your peace of mind.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Slider Section */}
      <div data-aos="fade-up">
        <ProductSlider />
      </div>

      {/* Work With Brands Section */}
      <div data-aos="fade-up">
        <WorkWithBrands />
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white" data-aos="zoom-in-up">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Partnership?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of retailers who trust Nayak Enterprises for their wholesale needs.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Register Your Store Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
