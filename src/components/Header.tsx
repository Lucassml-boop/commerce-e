import React from 'react'
import { useAuth } from '../hooks/useAuth'

interface HeaderProps {
  onLoginClick: () => void
  onAdminClick: () => void
  showingAdmin: boolean
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onAdminClick, showingAdmin }) => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-blue-600 shadow-lg border-b-4 border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
                TechStore
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">Início</a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">Produtos</a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">Categorias</a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">Ofertas</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={onAdminClick}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      showingAdmin 
                        ? 'bg-white text-blue-600 hover:bg-gray-100' 
                        : 'bg-blue-500 text-white hover:bg-blue-400 border border-blue-400'
                    }`}
                  >
                    {showingAdmin ? 'Ver Loja' : 'Painel Admin'}
                  </button>
                  
                  <div className="flex items-center space-x-3 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white font-medium hidden sm:block">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-all duration-200 border border-white"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
