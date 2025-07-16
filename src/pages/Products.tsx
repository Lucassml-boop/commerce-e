import React from 'react'
import { Layout } from '../components/Layout/Layout'
import { ProductGrid } from '../components/ProductGrid'

export const Products: React.FC = () => {
  return (
    <Layout showPromoBanner={false}>
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Nossos Produtos
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Explore nossa coleção completa de produtos selecionados especialmente para você
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative -mt-8">
          <ProductGrid />
        </div>
      </div>
    </Layout>
  )
}
