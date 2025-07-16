import React from 'react'
import { Layout } from '../components/Layout/Layout'
import { ProductGrid } from '../components/ProductGrid'

export const Home: React.FC = () => {
  return (
    <Layout>
      <ProductGrid />
    </Layout>
  )
}
