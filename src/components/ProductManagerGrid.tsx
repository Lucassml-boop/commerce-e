import React from 'react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  created_at: string
  is_on_offer?: boolean
  original_price?: number
  discount_percentage?: number
}

interface ProductManagerGridProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onCreateOffer: (product: Product) => void
  deletingProduct: string | null
}

export const ProductManagerGrid: React.FC<ProductManagerGridProps> = ({
  products,
  onEdit,
  onDelete,
  onCreateOffer,
  deletingProduct
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/E5E7EB/9CA3AF?text=Produto'
            }}
          />
          
          <div className="p-4">
            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {product.category}
              </span>
              {product.is_on_offer && (
                <span className="ml-2 inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Em Oferta
                </span>
              )}
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between mb-2">
              {product.is_on_offer && product.original_price ? (
                <div>
                  <span className="text-sm text-gray-500 line-through">
                    R$ {product.original_price.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-red-600 ml-2">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.discount_percentage && (
                    <span className="text-xs text-red-600 ml-1">
                      (-{Math.round(product.discount_percentage)}%)
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-lg font-bold text-blue-600">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Estoque: {product.stock} | Criado em: {new Date(product.created_at).toLocaleDateString()}
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-blue-600 text-gray-900 py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              
              <button
                onClick={() => onDelete(product.id)}
                disabled={deletingProduct === product.id}
                className="flex-1 bg-red-600 text-red-600 py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingProduct === product.id ? 'Excluindo...' : 'Excluir'}
              </button>
              
              {!product.is_on_offer && (
                <button
                  onClick={() => onCreateOffer(product)}
                  className="flex-1 bg-green-600 text-gray-900 py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Oferta
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
