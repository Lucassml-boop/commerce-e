import React from 'react'

interface OrderSummaryProps {
  total: number
  onBack: () => void
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ total, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Frete</span>
          <span className="text-green-600">Grátis</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-200 mb-4"
        onClick={() => alert('Funcionalidade de checkout em desenvolvimento!')}
      >
        Finalizar Compra
      </button>

      <button
        onClick={onBack}
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
      >
        Continuar Comprando
      </button>
    </div>
  )
}
