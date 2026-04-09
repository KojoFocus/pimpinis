export type Role = 'customer' | 'admin' | 'owner'

export interface Profile {
  id: string
  email: string
  role: Role
  full_name?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  category_id: string
  category?: Category
  selling_price: number
  cost_price?: number
  stock_qty: number
  images: string[]
  emoji?: string
  is_featured: boolean
  is_active: boolean
  badge?: 'new' | 'hot' | 'sale' | null
  colours?: string[]
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  subtotal: number
}

export interface StockEntry {
  id: string
  product_id: string
  product?: Product
  quantity: number
  unit_cost: number
  total_cost: number
  supplier?: string
  notes?: string
  entry_date: string
}

export interface Expenditure {
  id: string
  category: string
  amount: number
  description?: string
  expense_date: string
}

export interface TransportCost {
  id: string
  description: string
  amount: number
  transport_date: string
}

export interface IncomeStatementRow {
  period: string
  revenue: number
  cost_of_goods: number
  operating_expenses: number
  transport_costs: number
  gross_profit?: number
  net_profit?: number
  gross_margin_pct?: number
}

export interface CartItem {
  product: Product
  quantity: number
  size?: string
  colour?: string
}
