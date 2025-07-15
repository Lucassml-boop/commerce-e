import React, { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/Header'
import { LoginForm } from './components/LoginForm'
import { ProductGrid } from './components/ProductGrid'
import { AdminPanel } from './components/AdminPanel'
import { PromoBanner } from './components/PromoBanner'
import { Cart } from './components/Cart'

const AppContent: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const { user, loading } = useAuth()

  const handleLoginClick = (isLoginMode: boolean) => {
    setIsLoginMode(isLoginMode)
    setShowLogin(true)
    setShowAdmin(false)
    setShowCart(false)
  }

  const handleBackClick = () => {
    setShowLogin(false)
    setShowAdmin(false)
    setShowCart(false)
  }

  const handleAdminClick = () => {
    setShowAdmin(!showAdmin)
    setShowLogin(false)
    setShowCart(false)
  }

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode)
  }

  const handleHomeClick = () => {
    setShowLogin(false)
    setShowAdmin(false)
    setShowCart(false)
  }

  const handleCartClick = () => {
    setShowCart(true)
    setShowLogin(false)
    setShowAdmin(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (showLogin && !user) {
    return (
      <LoginForm 
        onToggleMode={handleToggleMode} 
        isLogin={isLoginMode}
        onBack={handleBackClick}
      />
    )
  }

  if (showCart && user) {
    return <Cart onBack={handleBackClick} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PromoBanner />
      <Header 
        onLoginClick={handleLoginClick} 
        onAdminClick={handleAdminClick}
        onHomeClick={handleHomeClick}
        onCartClick={handleCartClick}
        showingAdmin={showAdmin}
      />
      <main className="min-h-screen">
        {showAdmin ? <AdminPanel /> : <ProductGrid />}
      </main>
      
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">
                TechStore
              </h3>
              <p className="text-gray-300 mb-4">
                Sua loja online de tecnologia com os melhores produtos e preços do mercado. 
                Qualidade garantida e entrega rápida para todo o Brasil.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.433-2.001 4.72-.63.733-1.332 1.27-2.061 1.683v3.731c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-3.731c-.729-.413-1.431-.95-2.061-1.683-1.105-1.287-1.832-2.862-2.001-4.72-.016-.177.123-.334.301-.334h8.022c.178 0 .317.157.301.334z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Smartphones</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Laptops</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Acessórios</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gaming</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 TechStore. Todos os direitos reservados. Desenvolvido com React + Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
