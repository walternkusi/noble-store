'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { use } from 'react'
import { formatPrice } from '@/components/ProductCard'

type OrderData = {
  id: string
  customer: { fullName: string; phone: string; email: string; address: string; city: string }
  items: { id: string; name: string; price: number; quantity: number; size: string; color: string; image: string }[]
  deliveryMethod: string
  deliveryFee: number
  subtotal: number
  total: number
  notes: string
  createdAt: string
}

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(`order-${id}`)
    if (stored) {
      setOrder(JSON.parse(stored))
    }
  }, [id])

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-20 bg-gray-100 rounded-full mx-auto" />
          <div className="h-8 bg-gray-100 rounded w-2/3 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
        </div>
      </div>
    )
  }

  const deliveryDays = order.deliveryMethod === 'express' ? '1' : '2-3'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Checkmark */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500">Thank you for your purchase.</p>
        <p className="text-sm text-gray-400 mt-2">Order #{order.id}</p>
      </div>

      {/* Order Info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Customer Information</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>
            <span className="ml-2 text-gray-900 font-medium">{order.customer.fullName}</span>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <span className="ml-2 text-gray-900 font-medium">{order.customer.phone}</span>
          </div>
          {order.customer.email && (
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2 text-gray-900 font-medium">{order.customer.email}</span>
            </div>
          )}
          <div className="col-span-2">
            <span className="text-gray-500">Delivery Address:</span>
            <span className="ml-2 text-gray-900 font-medium">{order.customer.address}, {order.customer.city}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Ordered Products</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 h-18 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.size} / {item.color} &times; {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)} RWF</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatPrice(order.subtotal)} RWF</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery ({order.deliveryMethod})</span>
            <span>{formatPrice(order.deliveryFee)} RWF</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-rose-600">{formatPrice(order.total)} RWF</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8">
        <h3 className="font-bold text-green-800 mb-2">Expected Delivery</h3>
        <p className="text-green-700 text-sm">
          Your order will be delivered within <strong>{deliveryDays} business days</strong> to {order.customer.address}, {order.customer.city}.
        </p>
        <p className="text-green-700 text-sm mt-1">
          For inquiries, call us at 0788 626 555 or WhatsApp us.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/collection"
          className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
