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
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">E-Commerce</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={onAdminClick}
                  className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    showingAdmin 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {showingAdmin ? 'Ver Produtos' : 'Admin'}
                </button>
                <span className="text-gray-700">
                  Olá, {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sair
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
