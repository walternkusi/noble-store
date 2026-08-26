'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard, { type Product } from '@/components/ProductCard'

const categories = [
  {
    name: 'Short Dresses',
    slug: 'short-dresses',
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    name: 'Long Dresses',
    slug: 'long-dresses',
    gradient: 'from-purple-400 to-indigo-500',
  },
  {
    name: 'Complete Clothes',
    slug: 'complete-clothes',
    gradient: 'from-fuchsia-400 to-purple-500',
  },
  {
    name: 'Tops',
    slug: 'tops',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Shorts',
    slug: 'shorts',
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    name: 'Skirts',
    slug: 'skirts',
    gradient: 'from-red-400 to-rose-500',
  },
  {
    name: 'Pants',
    slug: 'pants',
    gradient: 'from-teal-400 to-cyan-500',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    gradient: 'from-amber-400 to-orange-500',
  },
]

const features = [
  {
    title: 'Quality Fashion',
    description: 'Handpicked premium fabrics and styles that stand the test of time.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Affordable Prices',
    description: 'Get runway-inspired looks without breaking the bank.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Easy Ordering',
    description: 'Simple, secure checkout process that takes just minutes.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
  },
  {
    title: 'Reliable Delivery',
    description: 'Fast and secure delivery right to your doorstep across Rwanda.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'Customer Support',
    description: 'Friendly team ready to help via phone, WhatsApp, or email.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/products?featured=true').then(r => r.json()),
      fetch('/api/products?newArrival=true').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([featuredData, newArrivalsData, allData]) => {
      setFeatured(Array.isArray(featuredData) ? featuredData : featuredData.products || [])
      setNewArrivals(Array.isArray(newArrivalsData) ? newArrivalsData : newArrivalsData.products || [])
      setAllProducts(Array.isArray(allData) ? allData : allData.products || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const productsByCategory = (slug: string) =>
    allProducts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === slug)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-8">
              <Image src="/logo.png" alt="NOBLE store" width={120} height={120} className="mx-auto rounded-2xl shadow-lg" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Discover Your{' '}
              <span className="bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                Style
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Explore our curated collection of trendy dresses and shoes designed to make you look and feel your best. Fashion that speaks your language.
            </p>
            <Link
              href="/collection"
              className="inline-block mt-8 bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-rose-700 transition-all duration-300 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300"
            >
              Shop Collection
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
          <p className="mt-3 text-gray-500">Our most popular picks loved by customers</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-3 text-gray-500">Find exactly what you are looking for</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((cat) => {
                const catProducts = productsByCategory(cat.slug)
                if (catProducts.length === 0) return null
                return (
                  <div key={cat.slug}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
                      <Link
                        href={`/collection?category=${cat.slug}`}
                        className={`text-sm font-medium bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent hover:opacity-80`}
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {catProducts.slice(0, 4).map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">New Arrivals</h2>
          <p className="mt-3 text-gray-500">Fresh styles just dropped</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="mt-3 text-gray-500">We make fashion accessible and enjoyable</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 text-rose-600 mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-rose-600 to-pink-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Your Perfect Look</h2>
          <p className="text-rose-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse our latest collection and discover outfits that match your personality and style.
          </p>
          <Link
            href="/collection"
            className="inline-block bg-white text-rose-600 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  )
}
