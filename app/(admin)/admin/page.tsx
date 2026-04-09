import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Package, ShoppingBag, AlertTriangle, TrendingUp, PlusCircle, ArrowRight, Clock, CheckCircle2, Truck } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { data: recentOrders },
    { data: lowStock },
    { data: allOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders')
      .select('id, status, total_amount, created_at, customer_name, customer_phone')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('products')
      .select('id, name, stock_qty, emoji')
      .eq('is_active', true)
      .lt('stock_qty', 5)
      .order('stock_qty', { ascending: true })
      .limit(5),
    supabase.from('orders')
      .select('total_amount, status, created_at'),
  ])

  // Revenue calculations
  const now = new Date()
  const startOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek    = new Date(startOfToday); startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay())
  const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1)

  const PAID_STATUSES = ['confirmed', 'shipped', 'delivered']

  function revenue(orders: any[], from?: Date) {
    return (orders ?? [])
      .filter(o => PAID_STATUSES.includes(o.status) && (!from || new Date(o.created_at) >= from))
      .reduce((s: number, o: any) => s + Number(o.total_amount), 0)
  }

  const revenueAll   = revenue(allOrders ?? [])
  const revenueMonth = revenue(allOrders ?? [], startOfMonth)
  const revenueWeek  = revenue(allOrders ?? [], startOfWeek)
  const revenueToday = revenue(allOrders ?? [], startOfToday)

  // Order pipeline counts
  const pipeline = ['pending','confirmed','shipped','delivered','cancelled'].reduce((acc: Record<string,number>, s) => {
    acc[s] = (allOrders ?? []).filter((o: any) => o.status === s).length
    return acc
  }, {})

  const stats = [
    {
      label: 'Total Revenue',
      value: `GHS ${revenueAll.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      sub: 'Confirmed & above',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-l-emerald-500',
    },
    {
      label: 'Active Products',
      value: activeProducts ?? 0,
      icon: Package,
      sub: `${totalProducts ?? 0} total`,
      color: 'text-[#C4873A]',
      bg: 'bg-[#C4873A]/8',
      border: 'border-l-[#C4873A]',
    },
    {
      label: 'Total Orders',
      value: totalOrders ?? 0,
      icon: ShoppingBag,
      sub: `${pendingOrders ?? 0} pending`,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-l-blue-500',
    },
    {
      label: 'Low Stock',
      value: lowStock?.length ?? 0,
      icon: AlertTriangle,
      sub: 'Items below 5 units',
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-l-red-500',
    },
  ]

  const STATUS_COLORS: Record<string, string> = {
    pending:   'bg-amber-50 text-amber-700 border border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
    shipped:   'bg-indigo-50 text-indigo-700 border border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back — here's your store overview</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#1A1208] hover:bg-[#C4873A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <PlusCircle size={15} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border, sub }) => (
          <div key={label} className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${border} p-5 shadow-sm`}>
            <div className={`inline-flex p-2 rounded-xl ${bg} mb-3`}>
              <Icon size={17} className={color} />
            </div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-800">Revenue Breakdown</h2>
          <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">Confirmed + shipped + delivered</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Today',      value: revenueToday },
            { label: 'This Week',  value: revenueWeek },
            { label: 'This Month', value: revenueMonth },
            { label: 'All Time',   value: revenueAll },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className="font-serif font-bold text-[#7A4F2D] text-xl">
                GHS {value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Pipeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-800">Order Pipeline</h2>
          <Link href="/admin/orders" className="text-xs text-[#C4873A] hover:text-[#7A4F2D] flex items-center gap-1 font-medium">
            Manage <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'pending',   label: 'Pending',   icon: Clock,         color: 'bg-amber-50 border-amber-200 text-amber-700',   num: 'text-amber-700' },
            { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2,  color: 'bg-blue-50 border-blue-200 text-blue-600',      num: 'text-blue-700' },
            { key: 'shipped',   label: 'Shipped',   icon: Truck,         color: 'bg-indigo-50 border-indigo-200 text-indigo-600',num: 'text-indigo-700' },
            { key: 'delivered', label: 'Delivered', icon: Package,       color: 'bg-emerald-50 border-emerald-200 text-emerald-600', num: 'text-emerald-700' },
            { key: 'cancelled', label: 'Cancelled', icon: AlertTriangle, color: 'bg-red-50 border-red-200 text-red-500',         num: 'text-red-600' },
          ].map(({ key, label, icon: Icon, color, num }, idx, arr) => (
            <div key={key} className="flex items-center gap-2 flex-shrink-0">
              <div className={`border rounded-2xl px-5 py-4 text-center min-w-[100px] ${color}`}>
                <Icon size={18} className="mx-auto mb-1.5" />
                <p className={`text-2xl font-bold ${num}`}>{pipeline[key] ?? 0}</p>
                <p className="text-xs font-semibold mt-0.5">{label}</p>
              </div>
              {idx < arr.length - 1 && <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#C4873A] hover:text-[#7A4F2D] flex items-center gap-1 font-medium">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-3 text-left font-semibold">Order</th>
                  <th className="px-6 py-3 text-left font-semibold">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-right font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(recentOrders ?? []).map((o: any) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-400">#{o.id.slice(0, 8)}</td>
                    <td className="px-6 py-3.5 text-gray-700 font-medium">{o.customer_name || 'Walk-in'}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-gray-800">
                      GHS {Number(o.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!recentOrders?.length && (
              <div className="text-center py-14">
                <ShoppingBag size={32} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Low Stock</h2>
            <Link href="/admin/products" className="text-xs text-[#C4873A] hover:text-[#7A4F2D] font-medium">Manage</Link>
          </div>
          <div className="p-4 space-y-2">
            {lowStock?.length ? lowStock.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{p.emoji || '📦'}</span>
                  <span className="text-sm text-gray-700 font-medium truncate max-w-[120px]">{p.name}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  p.stock_qty === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {p.stock_qty === 0 ? 'Out' : `${p.stock_qty} left`}
                </span>
              </div>
            )) : (
              <div className="text-center py-8">
                <Package size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="text-gray-400 text-sm">All products well stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/products/new', label: 'Add Product',  icon: PlusCircle,   color: 'text-[#C4873A]',   bg: 'bg-[#C4873A]/8' },
            { href: '/admin/orders',       label: 'View Orders',  icon: ShoppingBag,  color: 'text-blue-500',    bg: 'bg-blue-50' },
            { href: '/admin/products',     label: 'Manage Stock', icon: Package,      color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { href: '/admin/categories',   label: 'Categories',   icon: AlertTriangle,color: 'text-purple-500',  bg: 'bg-purple-50' },
          ].map(a => (
            <Link
              key={a.href}
              href={a.href}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-[#C4873A]/30 hover:shadow-md transition-all shadow-sm text-center"
            >
              <div className={`p-3 rounded-xl ${a.bg}`}>
                <a.icon size={20} className={a.color} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
