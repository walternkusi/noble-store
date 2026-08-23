'use client'

import Link from 'next/link'
import { useState } from 'react'

export type Product = {
  id: string
  name: string
  images: string[]
  category: string
  description?: string
  colors?: string[]
  sizes?: string[]
  stock?: number
  featured?: boolean
  isNew?: boolean
  newArrival?: boolean
  details?: Record<string, string>
  buyingPrice?: number | string
  rentPrice?: number | string
}

function formatPrice(price: number | string): string {
  return Number(price).toLocaleString('en-RW')
}

export default function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false)
  const imgSrc = !imgError && product.images?.[0] ? product.images[0] : '/placeholder.svg'

  return (
    <Link
      href={`/collection?category=${encodeURIComponent(product.category.toLowerCase().replace(/\s+/g, '-'))}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
        {product.newArrival && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            New
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-rose-500 font-medium uppercase tracking-wide mb-1">
          {product.category.replace('-', ' ')}
        </p>
        <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        {/* Buy/Rent Price */}
        {(product.buyingPrice || product.rentPrice) && (
          <div className="mt-2 space-y-1">
            {/* Buying Price (main price) */}
            {product.buyingPrice && (
              <p className="text-lg font-bold text-rose-600">
                {formatPrice(product.buyingPrice)} RWF
              </p>
            )}
            {/* Rent Price */}
            {product.rentPrice && Number(product.rentPrice) > 0 && (
              <p className="text-sm text-gray-500">
                Rent: {formatPrice(product.rentPrice)} RWF
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export { formatPrice }
