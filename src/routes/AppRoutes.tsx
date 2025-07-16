import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Cart } from '../pages/Cart'
import { AdminPanel } from '../pages/AdminPanel'
import { ProductDetails } from '../pages/ProductDetails'
import { LoadingSpinner } from '../components/LoadingSpinner'

export const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/produto/:id" element={<ProductDetails />} />
      
      {/* Rotas de autenticação (apenas para usuários não logados) */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <Register />} 
      />
      
      {/* Rotas protegidas (apenas para usuários logados) */}
      <Route 
        path="/carrinho" 
        element={user ? <Cart /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/admin" 
        element={user ? <AdminPanel /> : <Navigate to="/login" replace />} 
      />
      
      {/* Rota de fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
