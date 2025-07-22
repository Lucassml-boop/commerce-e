import React from 'react'
import { Layout } from '../components/Layout/Layout'

export const About: React.FC = () => (
  <Layout showPromoBanner={false}>
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Sobre Nós</h1>
      <p className="text-gray-700 text-lg mb-4">
        Somos apaixonados por tecnologia e inovação! A TechStore nasceu para oferecer os melhores produtos, atendimento de excelência e entrega rápida para todo o Brasil.
      </p>
      <p className="text-gray-600">
        Nossa missão é conectar pessoas à tecnologia de forma simples, acessível e segura.
      </p>
    </div>
  </Layout>
)
