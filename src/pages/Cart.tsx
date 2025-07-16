import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { Cart as CartComponent } from '../components/Cart'

export const Cart: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  return (
    <Layout showPromoBanner={false}>
      <CartComponent onBack={handleBack} />
    </Layout>
  )
}
