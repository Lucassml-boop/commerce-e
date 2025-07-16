import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { PromoBanner } from '../PromoBanner'

interface LayoutProps {
  children: React.ReactNode
  showPromoBanner?: boolean
}

export const Layout: React.FC<LayoutProps> = ({ children, showPromoBanner = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showPromoBanner && <PromoBanner />}
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
