'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { formatPrice } from '@/components/ProductCard'

export default function CartPage() {
  const { items, removeItem, updateQuantity, updateSize, subtotal, clearCart } = useCart()
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard')

  const deliveryFee = deliveryMethod === 'standard' ? 2000 : 4000
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you have not added anything yet.</p>
        <Link
          href="/collection"
          className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 flex gap-4 shadow-sm">
              <div className="w-24 h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.color}</p>
                  </div>
                  <p className="font-bold text-rose-600 whitespace-nowrap">{formatPrice(item.price * item.quantity)} RWF</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {/* Size change */}
                  <select
                    value={item.size}
                    onChange={(e) => updateSize(item.id, item.color, item.size, e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="ml-auto text-red-400 hover:text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                <p className="text-sm text-gray-400 mt-1">{formatPrice(item.price)} RWF each</p>
              </div>
            </div>
          ))}

          <Link href="/collection" className="inline-flex items-center gap-2 text-rose-600 font-medium hover:underline text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold">{formatPrice(subtotal)} RWF</span>
              </div>

              <div>
                <span className="text-gray-500 block mb-2">Delivery Method</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="accent-rose-600"
                    />
                    <div>
                      <span className="text-sm font-medium">Standard (2-3 days)</span>
                      <span className="text-sm text-gray-500 ml-2">2,000 RWF</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="accent-rose-600"
                    />
                    <div>
                      <span className="text-sm font-medium">Express (1 day)</span>
                      <span className="text-sm text-gray-500 ml-2">4,000 RWF</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-semibold">{formatPrice(deliveryFee)} RWF</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-rose-600 text-lg">{formatPrice(total)} RWF</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-rose-600 text-white py-3.5 rounded-full font-semibold hover:bg-rose-700 transition-colors mt-6 shadow-lg shadow-rose-200"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
