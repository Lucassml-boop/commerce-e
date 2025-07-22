import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { Product } from '../lib/supabase'

export const Offers: React.FC = () => {
  const [offers, setOffers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_on_offer', true)
        .gt('stock', 0)
        .order('discount_percentage', { ascending: false })

      if (error) throw error
      setOffers(data || [])
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string) => {
    if (!user) {
      alert('Faça login para adicionar ao carrinho')
      return
    }

    try {
      const { data: existingItems, error: checkError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (checkError) throw checkError

      if (existingItems && existingItems.length > 0) {
        const existingItem = existingItems[0]
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)

        if (updateError) throw updateError
        alert('Quantidade do produto atualizada no carrinho!')
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: 1
          })

        if (insertError) throw insertError
        alert('Produto adicionado ao carrinho!')
      }

      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar produto ao carrinho')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
               <span className="text-red-600">Super Ofertas</span> 
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Aproveite nossas promoções especiais com descontos imperdíveis!
            </p>
            
            <div className="mt-6">
              <p className="text-lg text-red-600 font-semibold">
                {offers.length} produtos em oferta disponíveis
              </p>
            </div>
          </div>

          {offers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Nenhuma oferta disponível no momento
              </h3>
              <p className="text-gray-600 mb-6">
                Fique atento! Em breve teremos ofertas incríveis para você!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offers.map((product) => (
                <div key={product.id} className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-red-200 relative">
                  {/* Badge de destaque para ofertas */}
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg text-sm font-bold z-10">
                    OFERTA
                  </div>
                  
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/E5E7EB/9CA3AF?text=Produto'
                      }}
                    />
                    
                    {/* Badge de desconto */}
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg animate-pulse">
                      -{Math.round(product.discount_percentage || 0)}% OFF
                    </div>
                    
                    {/* Economia */}
                    {product.original_price && (
                      <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Economize R$ {(product.original_price - product.price).toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Preços com destaque */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg text-gray-500 line-through">
                          R$ {product.original_price?.toFixed(2)}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
                          -{Math.round(product.discount_percentage || 0)}%
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        R$ {product.price.toFixed(2)}
                      </div>
                    </div>
                    
                    {/* Data de validade da oferta */}
                    {product.offer_end_date && (
                      <div className="mb-4 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        ⏰ Oferta válida até: {new Date(product.offer_end_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-full bg-white hover:bg-red-700 text-gray-700 py-3 px-4 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                       Aproveitar Oferta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
