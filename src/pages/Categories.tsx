import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'

interface CategoryStats {
  name: string
  count: number
  minPrice: number
  maxPrice: number
  imageUrl: string
}

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryStats[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')

      if (error) throw error

      // Agrupar produtos por categoria e calcular estatísticas
      const categoryMap = new Map<string, Product[]>()
      
      products?.forEach(product => {
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, [])
        }
        categoryMap.get(product.category)?.push(product)
      })

      const categoryStats: CategoryStats[] = Array.from(categoryMap.entries()).map(([name, products]) => {
        const prices = products.map(p => p.price)
        return {
          name,
          count: products.length,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          imageUrl: products[0]?.image_url || 'https://via.placeholder.com/300x200/E5E7EB/9CA3AF?text=Categoria'
        }
      }).sort((a, b) => b.count - a.count) // Ordenar por quantidade de produtos

      setCategories(categoryStats)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryName: string) => {
    // Navegar para a página de produtos com filtro de categoria
    navigate(`/produtos?categoria=${encodeURIComponent(categoryName)}`)
  }

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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Explore por Categorias
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
                Encontre exatamente o que você procura navegando pelas nossas categorias organizadas
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
              <p className="text-gray-600">Adicione alguns produtos para ver as categorias aqui.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {categories.length} Categorias Disponíveis
                </h2>
                <p className="text-lg text-gray-600">
                  Clique em uma categoria para ver todos os produtos relacionados
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer transform hover:-translate-y-2"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200/E5E7EB/9CA3AF?text=' + encodeURIComponent(category.name)
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {category.count} produtos
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          {category.count} itens
                        </span>
                        <span className="flex items-center font-medium text-green-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          R$ {category.minPrice.toFixed(2)} - R$ {category.maxPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                          Ver produtos →
                        </span>
                        <div className="flex items-center text-orange-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Não encontrou o que procura?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Explore todos os nossos produtos ou use nossa ferramenta de busca avançada
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/produtos')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Ver Todos os Produtos
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                    >
                      Voltar ao Início
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
