"use client"

import Image from "next/image"
import { useRef, useEffect } from "react"

const brands = [
  { name: "Aipl", logo: "/images/home/aipl.png" },
  { name: "Charminar", logo: "/images/home/charminar.png" },
  { name: "hp", logo: "/images/home/hp.png" },
  { name: "jivanjore", logo: "/images/home/jivanjore.png" },
  { name: "jksuperdrive", logo: "/images/home/jksuperdrive.png" },
  { name: "kores", logo: "/images/home/Kores.png" },
  { name: "Mobaj", logo: "/images/home/mobaj.png" },
  { name: "petro", logo: "/images/home/petro.png" },
  { name: "pioneer", logo: "/images/home/Pioneer.png" },
  { name: "sheenac", logo: "/images/home/sheenac.png" },
  { name: "UrbanEdge", logo: "/images/home/UrbanEdge.png" }
]

export function WorkWithBrands() {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let frameId
    const speed = 0.5 // pixels per frame

    const scroll = () => {
      if (!el) return

      el.scrollLeft += speed

      // Reset scroll position for seamless loop
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0
      }

      frameId = requestAnimationFrame(scroll)
    }

    frameId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(frameId)
  }, [])

  const brandList = [...brands, ...brands] // duplicate for loop

  return (
    <section className="py-12 bg-slate-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          We Work With Leading Brands
        </h2>
        <div
          ref={scrollRef}
          className="flex overflow-hidden whitespace-nowrap relative"
        >
          {brandList.map((brand, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center min-w-[150px] px-4 shrink-0"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={100}
                height={60}
                className="object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
