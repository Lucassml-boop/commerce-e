import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export const useCart = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const { user } = useAuth()

  // Fetch cart items count
  const fetchCartItemsCount = async () => {
    if (!user) {
      setCartItemsCount(0)
      return
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)

      if (error) throw error
      
      // Sum all quantities instead of just counting rows
      const totalItems = (data || []).reduce((sum, item) => sum + item.quantity, 0)
      setCartItemsCount(totalItems)
    } catch (error) {
      console.error('Erro ao buscar itens do carrinho:', error)
    }
  }

  // Update cart count when user changes
  useEffect(() => {
    fetchCartItemsCount()
  }, [user])

  // Listen for custom cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartItemsCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  // Set up real-time subscription for cart updates
  useEffect(() => {
    if (!user) return

    const subscription = supabase
      .channel(`cart_changes_${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchCartItemsCount()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return {
    cartItemsCount,
    refreshCartCount: fetchCartItemsCount
  }
}
