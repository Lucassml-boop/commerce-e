import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vxplsotjoiopdiingzbe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cGxzb3Rqb2lvcGRpaW5nemJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzMyNjgsImV4cCI6MjA2ODEwOTI2OH0.IxOwHGasMHalvTTN9DGhQRpHjBF8191Wpwb3C7GhFBw'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos TypeScript para o banco de dados
export interface User {
  id: string
  email: string
  created_at: string
  full_name?: string
  avatar_url?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  created_at: string
  is_on_offer?: boolean
  original_price?: number
  discount_percentage?: number
  offer_start_date?: string
  offer_end_date?: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
}
