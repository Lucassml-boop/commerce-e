import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { SearchAndFilters } from './SearchAndFilters'
import { useSearchParams } from 'react-router-dom'

export const ProductGrid: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
  const [sortBy, setSortBy] = useState('name-asc')
  const { user } = useAuth()
  
  // Adicionar suporte para parâmetros de URL
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchProducts()
  }, [])

  // Aplicar filtros da URL quando carregado
  useEffect(() => {
    const categoryFromUrl = searchParams.get('categoria')
    if (categoryFromUrl) {
      setSelectedCategory(decodeURIComponent(categoryFromUrl))
    }
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllProducts(data || [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Extrair categorias únicas dos produtos
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(allProducts.map(product => product.category))]
    return uniqueCategories.filter(Boolean).sort()
  }, [allProducts])

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filtro por preço
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    return sorted
  }, [allProducts, searchTerm, selectedCategory, priceRange, sortBy])

  const addToCart = async (productId: string) => {
    if (!user) {
      alert('Faça login para adicionar ao carrinho')
      return
    }

    try {
      // First, check if the product is already in the cart
      const { data: existingItems, error: checkError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (checkError) {
        throw checkError
      }

      if (existingItems && existingItems.length > 0) {
        // Update existing item quantity
        const existingItem = existingItems[0]
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)

        if (updateError) throw updateError
        alert('Quantidade do produto atualizada no carrinho!')
      } else {
        // Insert new item
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

      // Dispatch custom event to update cart count immediately
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar produto ao carrinho')
    }
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Componente de busca e filtros */}
      <SearchAndFilters
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onPriceRangeChange={handlePriceRangeChange}
        onSortChange={setSortBy}
        categories={categories}
        currentSearch={searchTerm}
        currentCategory={selectedCategory}
        currentSort={sortBy}
      />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Produtos em <span className="text-blue-600">Destaque</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra nossa seleção exclusiva de produtos com a melhor qualidade e preços imbatíveis
          </p>
          
          {/* Contador de resultados */}
          <div className="mt-6">
            <p className="text-lg text-gray-700">
              {filteredAndSortedProducts.length === allProducts.length ? (
                `${filteredAndSortedProducts.length} produtos disponíveis`
              ) : (
                `${filteredAndSortedProducts.length} de ${allProducts.length} produtos encontrados`
              )}
            </p>
          </div>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {allProducts.length === 0 ? 'Nenhum produto encontrado' : 'Nenhum produto corresponde aos filtros'}
            </h3>
            <p className="text-gray-600 mb-6">
              {allProducts.length === 0 
                ? 'Em breve teremos novidades incríveis para você!' 
                : 'Tente ajustar os filtros ou fazer uma nova busca.'
              }
            </p>
            {searchTerm || selectedCategory || priceRange.min > 0 || priceRange.max < Infinity ? (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setPriceRange({ min: 0, max: Infinity })
                  setSortBy('name-asc')
                }}
                className="bg-blue-600 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Limpar Filtros
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full">
                <div className="relative overflow-hidden h-64 flex-shrink-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/E5E7EB/9CA3AF?text=Produto'
                    }}
                  />
                  
                  {/* Badge de oferta */}
                  {product.is_on_offer && product.discount_percentage && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{Math.round(product.discount_percentage)}% OFF
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
                    </span>
                  </div>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Esgotado</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 min-h-[4.5rem] flex-grow overflow-hidden">
                    <span className="line-clamp-3">
                      {product.description}
                    </span>
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {product.is_on_offer && product.original_price ? (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500 line-through">
                            R$ {product.original_price.toFixed(2)}
                          </span>
                          <span className="text-2xl font-bold text-red-600">
                            R$ {product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 mt-auto ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-gray shadow-md hover:shadow-lg'
                    }`}
                  >
                    {product.stock === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
