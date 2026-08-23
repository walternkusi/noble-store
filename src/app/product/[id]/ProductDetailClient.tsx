'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart, type CartItem } from '@/components/CartProvider'
import ProductCard, { type Product, formatPrice } from '@/components/ProductCard'

export default function ProductDetailClient({ productId }: { productId: string }) {
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [related, setRelated] = useState<Product[]>([])
  const [addedMsg, setAddedMsg] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data)
        if (data.colors?.length) setSelectedColor(data.colors[0])
        if (data.sizes?.length) setSelectedSize(data.sizes[0])
        setLoading(false)

        fetch(`/api/products?category=${data.category}`)
          .then(r => r.json())
          .then(all => {
            const arr = Array.isArray(all) ? all : all.products || []
            setRelated(arr.filter((p: Product) => p.id !== data.id).slice(0, 4))
          })
      })
      .catch(() => setLoading(false))
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    const item: Omit<CartItem, 'quantity'> = {
      id: product.id,
      name: product.name,
      price: Number(product.buyingPrice || (product as any).price),
      image: product.images?.[0] || '',
      size: selectedSize,
      color: selectedColor,
      category: product.category,
    }
    addItem(item, quantity)
    setAddedMsg(true)
    setTimeout(() => setAddedMsg(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // router.push('/cart') // commented out - cart hidden for now
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-2xl h-[500px] animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-100 rounded animate-pulse w-1/4" />
            <div className="h-10 bg-gray-100 rounded animate-pulse w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <Link href="/collection" className="mt-4 inline-block text-rose-600 font-medium hover:underline">
          Back to Collection
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-rose-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/collection" className="hover:text-rose-600">Collection</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square">
            <img
              src={product.images?.[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-rose-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-rose-500 font-medium uppercase tracking-wide mb-2">
            {product.category.replace(/-/g, ' ')}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          {product.buyingPrice && (
            <p className="text-3xl font-bold text-rose-600 mb-6">{formatPrice(product.buyingPrice)} RWF</p>
          )}

          {/* Rent Price */}
          {product.rentPrice && Number(product.rentPrice) > 0 && (
            <p className="text-lg font-medium text-gray-600 mb-4">
              Rent: {formatPrice(product.rentPrice)} RWF
            </p>
          )}

          {/* Fallback for products with price field only */}
          {!product.buyingPrice && (product as any).price && (
            <p className="text-3xl font-bold text-rose-600 mb-6">{formatPrice((product as any).price)} RWF</p>
          )}

          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Color: <span className="font-normal text-gray-500">{selectedColor}</span></h3>
              <div className="flex gap-3">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === c ? 'border-rose-600 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: c.toLowerCase() === 'white' ? '#f5f5f5' : c.toLowerCase() }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Size: <span className="font-normal text-gray-500">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedSize === s
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          {product.stock !== undefined && (
            <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-rose-600 text-white py-3.5 rounded-full font-semibold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
            >
              {addedMsg ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gray-900 text-white py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          {product.details && Object.keys(product.details).length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
              <dl className="space-y-2">
                {Object.entries(product.details).map(([key, value]) => (
                  <div key={key} className="flex text-sm">
                    <dt className="w-40 text-gray-500 font-medium capitalize">{key.replace(/-/g, ' ')}</dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
