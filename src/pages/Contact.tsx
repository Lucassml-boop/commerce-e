import React from 'react'
import { Layout } from '../components/Layout/Layout'

export const Contact: React.FC = () => (
  <Layout showPromoBanner={false}>
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Contato</h1>
      <p className="text-gray-700 text-lg mb-4">
        Precisa falar com a gente? Envie um e-mail para <a href="mailto:contato@techstore.com" className="text-blue-600 underline">contato@techstore.com</a> ou preencha o formulário abaixo.
      </p>
      <form className="space-y-4">
        <input type="text" placeholder="Seu nome" className="w-full border rounded px-3 py-2" />
        <input type="email" placeholder="Seu e-mail" className="w-full border rounded px-3 py-2" />
        <textarea placeholder="Sua mensagem" className="w-full border rounded px-3 py-2" rows={4} />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Enviar</button>
      </form>
    </div>
  </Layout>
)
