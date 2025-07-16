import React from 'react'

interface CartItemProps {
  item: {
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
  updating: string | null
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

export const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  updating, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80/E5E7EB/9CA3AF?text=Produto'
          }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
          <p className="text-gray-600">Estoque: {item.product.stock} disponíveis</p>
          <p className="text-xl font-bold text-blue-600">
            R$ {item.product.price.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={updating === item.id || item.quantity <= 1}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={updating === item.id || item.quantity >= item.product.stock}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => onRemoveItem(item.id)}
          disabled={updating === item.id}
          className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
