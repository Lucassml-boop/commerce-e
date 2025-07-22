import React from 'react'
import { Layout } from '../components/Layout/Layout'

export const FAQ: React.FC = () => (
  <Layout showPromoBanner={false}>
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Perguntas Frequentes (FAQ)</h1>
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg text-gray-900">Como faço um pedido?</h2>
          <p className="text-gray-700">Basta navegar pelos produtos, adicionar ao carrinho e finalizar a compra!</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg text-gray-900">Quais formas de pagamento são aceitas?</h2>
          <p className="text-gray-700">Aceitamos cartões de crédito, boleto e Pix.</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg text-gray-900">Como acompanho meu pedido?</h2>
          <p className="text-gray-700">Você receberá um e-mail com o código de rastreio após a confirmação do envio.</p>
        </div>
      </div>
    </div>
  </Layout>
)
