import React from 'react'
import { Layout } from '../components/Layout/Layout'
import { AdminPanel as AdminPanelComponent } from '../components/AdminPanel'

export const AdminPanel: React.FC = () => {
  return (
    <Layout showPromoBanner={false}>
      <AdminPanelComponent />
    </Layout>
  )
}
