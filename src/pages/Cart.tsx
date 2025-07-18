import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { CartItem } from '../components/cart/CartItem'
import { OrderSummary } from '../components/cart/OrderSummary'

interface CartItemType {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string
    stock: number
  }
}

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchCartItems()
    }
  }, [user])

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartItems()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const fetchCartItems = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products!inner (
            id,
            name,
            price,
            image_url,
            stock
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error
      
      type SupabaseProduct = {
        id: string
        name: string
        price: number
        image_url: string
        stock: number
      }
      
      type SupabaseCartItemResponse = {
        id: string
        quantity: number
        products: SupabaseProduct | SupabaseProduct[]
      }
      
      const transformedData: CartItemType[] = ((data as unknown as SupabaseCartItemResponse[]) || [])
        .filter(item => {
          const product = Array.isArray(item.products) ? item.products[0] : item.products
          return product && product.id
        })
        .map(item => {
          const product = Array.isArray(item.products) ? item.products[0] : item.products
          
          return {
            id: item.id,
            quantity: item.quantity,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              stock: product.stock
            }
          }
        })
      
      setCartItems(transformedData)
    } catch (error) {
      console.error('Erro ao buscar itens do carrinho:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(itemId)
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
      
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error)
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
      
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (error) {
      console.error('Erro ao remover item:', error)
    } finally {
      setUpdating(null)
    }
  }

  const clearCart = async () => {
    if (!confirm('Tem certeza que deseja limpar o carrinho?')) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user?.id)

      if (error) throw error
      await fetchCartItems()
      
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
    }
  }

  const total = cartItems.reduce((sum, item) => {
    if (!item || !item.product || typeof item.product.price !== 'number' || typeof item.quantity !== 'number') {
      return sum
    }
    return sum + (item.product.price * item.quantity)
  }, 0)

  if (loading) {
    return (
      <Layout showPromoBanner={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showPromoBanner={false}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h3>
              <p className="text-gray-600 mb-6">Adicione alguns produtos para continuar suas compras.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Itens ({cartItems.length})</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Limpar carrinho
                  </button>
                </div>

                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updating={updating}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                ))}
              </div>

              <div className="lg:col-span-1">
                <OrderSummary total={total} onBack={() => navigate('/')} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
