'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size: string
  color: string
  category: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  updateSize: (id: string, color: string, oldSize: string, newSize: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'bloom-cart'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // silently fail
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(loadCart())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      saveCart(items)
    }
  }, [items, mounted])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === item.id && i.size === item.size && i.color === item.color
      )
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      }
      return [...prev, { ...item, quantity }]
    })
  }, [])

  const removeItem = useCallback((id: string, size: string, color: string) => {
    setItems(prev => prev.filter(
      i => !(i.id === id && i.size === size && i.color === color)
    ))
  }, [])

  const updateQuantity = useCallback((id: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size, color)
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.id === id && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    )
  }, [removeItem])

  const updateSize = useCallback((id: string, color: string, oldSize: string, newSize: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === id && i.size === oldSize && i.color === color
      )
      if (existingIndex < 0) return prev

      const duplicateIndex = prev.findIndex(
        i => i.id === id && i.size === newSize && i.color === color
      )

      const updated = [...prev]

      if (duplicateIndex >= 0 && duplicateIndex !== existingIndex) {
        updated[duplicateIndex] = {
          ...updated[duplicateIndex],
          quantity: updated[duplicateIndex].quantity + updated[existingIndex].quantity,
        }
        updated.splice(existingIndex, 1)
      } else {
        updated[existingIndex] = { ...updated[existingIndex], size: newSize }
      }

      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateSize,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
