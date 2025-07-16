import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para a loja
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Detalhes do Produto</h1>
            <p className="text-gray-600 mb-4">ID do produto: {id}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Em desenvolvimento</h2>
              <p className="text-blue-700">
                Esta página será implementada em breve com informações detalhadas do produto, 
                galeria de imagens, especificações técnicas e avaliações dos clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
