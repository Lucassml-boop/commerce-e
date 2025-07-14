import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
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
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        })

      if (error) throw error
      alert('Produto adicionado ao carrinho!')
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar produto ao carrinho')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-8">
          Nossos Produtos
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Produto'
                    }}
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  R$ {product.price.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Estoque: {product.stock} unidades
                </p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
