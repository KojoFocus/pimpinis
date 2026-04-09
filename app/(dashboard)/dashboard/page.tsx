import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PlusCircle, FileBarChart2 } from 'lucide-react'

export default async function DashboardOverview() {
  const supabase = await createServerSupabaseClient()

  const [
    { data: stockData },
    { data: expenditureData },
    { data: transportData },
    { data: ordersData },
    { data: recentStock },
    { data: recentExpenses },
  ] = await Promise.all([
    supabase.from('stock_entries').select('total_cost').gte('entry_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('expenditures').select('amount').gte('expense_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('transport_costs').select('amount').gte('transport_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('orders').select('total_amount').eq('status', 'delivered').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('stock_entries').select('*, product:products(name, emoji)').order('entry_date', { ascending: false }).limit(5),
    supabase.from('expenditures').select('*').order('expense_date', { ascending: false }).limit(5),
  ])

  const revenue   = (ordersData ?? []).reduce((s: number, o: any) => s + Number(o.total_amount), 0)
  const cogs      = (stockData ?? []).reduce((s: number, o: any) => s + Number(o.total_cost), 0)
  const opex      = (expenditureData ?? []).reduce((s: number, o: any) => s + Number(o.amount), 0)
  const transport = (transportData ?? []).reduce((s: number, o: any) => s + Number(o.amount), 0)
  const grossProfit = revenue - cogs
  const netProfit   = grossProfit - opex - transport

  const stats = [
    { label: 'Revenue', value: revenue, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', sub: 'This month (delivered)' },
    { label: 'Stock Cost (COGS)', value: cogs, icon: TrendingDown, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', sub: 'This month' },
    { label: 'Operating Expenses', value: opex + transport, icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', sub: `Incl. GHS ${transport.toFixed(2)} transport` },
    { label: 'Net Profit', value: netProfit, icon: BarChart3, color: netProfit >= 0 ? 'text-emerald-600' : 'text-red-600', bg: netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50', border: netProfit >= 0 ? 'border-emerald-200' : 'border-red-200', sub: 'This month' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Overview</h1>
          <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/stock" className="flex items-center gap-1.5 bg-[#C4873A] hover:bg-[#7A4F2D] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <PlusCircle size={15} /> Record Stock
          </Link>
          <Link href="/dashboard/reports" className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:border-[#C4873A] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FileBarChart2 size={15} /> P&amp;L Report
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border, sub }) => (
          <div key={label} className={`bg-white rounded-xl border ${border} p-5 shadow-sm`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>GHS {value.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">{sub}</p>
              </div>
              <div className={`${bg} p-2.5 rounded-lg`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stock */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Stock Entries</h2>
            <Link href="/dashboard/stock" className="text-xs text-[#C4873A] hover:underline">+ Add entry</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentStock?.length ? recentStock.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.product?.emoji || '📦'}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.product?.name}</p>
                    <p className="text-xs text-gray-400">{s.quantity} units @ GHS {Number(s.unit_cost).toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">GHS {Number(s.total_cost).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{new Date(s.entry_date).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            )) : <p className="text-gray-400 text-sm py-8 text-center">No stock entries yet</p>}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Expenditures</h2>
            <Link href="/dashboard/expenditure" className="text-xs text-[#C4873A] hover:underline">+ Add expense</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentExpenses?.length ? recentExpenses.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 capitalize">{e.category}</p>
                  <p className="text-xs text-gray-400">{e.description || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">−GHS {Number(e.amount).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{new Date(e.expense_date).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            )) : <p className="text-gray-400 text-sm py-8 text-center">No expenses recorded yet</p>}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/dashboard/stock',       label: 'Record Stock',      icon: '📦' },
          { href: '/dashboard/expenditure', label: 'Log Expense',       icon: '💸' },
          { href: '/dashboard/transport',   label: 'Transport Cost',    icon: '🚚' },
          { href: '/dashboard/reports',     label: 'P&L Report',        icon: '📊' },
        ].map(a => (
          <Link
            key={a.href}
            href={a.href}
            className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 text-sm font-medium text-gray-700 hover:border-[#C4873A] hover:text-[#C4873A] transition-all shadow-sm text-center"
          >
            <span className="text-2xl">{a.icon}</span>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
