import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { Categories } from './pages/Categories'
import { Offers } from './pages/Offers'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Cart } from './pages/Cart'
import { AdminPanel } from './pages/AdminPanel'
import { ProductDetails } from './pages/ProductDetails'
import { LoadingSpinner } from './components/LoadingSpinner'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { FAQ } from './pages/FAQ'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Products />} />
      <Route path="/categorias" element={<Categories />} />
      <Route path="/ofertas" element={<Offers />} />
      <Route path="/produto/:id" element={<ProductDetails />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
