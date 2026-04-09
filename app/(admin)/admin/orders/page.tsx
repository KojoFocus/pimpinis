import { createAdminClient } from '@/lib/supabase/admin'
import OrderStatusSelect from './OrderStatusSelect'
import { ShoppingBag } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending:   { label: 'Pending',   classes: 'bg-amber-50 text-amber-700 border border-amber-200' },
  confirmed: { label: 'Confirmed', classes: 'bg-blue-50 text-blue-700 border border-blue-200' },
  shipped:   { label: 'Shipped',   classes: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
  delivered: { label: 'Delivered', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-700 border border-red-200' },
}

export default async function OrdersPage() {
  const supabase = createAdminClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(id, quantity, unit_price, size, product:products(name, emoji))')
    .order('created_at', { ascending: false })

  const total = orders?.length ?? 0
  const revenue = (orders ?? [])
    .filter((o: any) => ['confirmed','shipped','delivered'].includes(o.status))
    .reduce((s: number, o: any) => s + Number(o.total_amount), 0)
  const pending = (orders ?? []).filter((o: any) => o.status === 'pending').length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {total} total · {pending} pending · GHS {revenue.toFixed(2)} delivered revenue
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, { label, classes }]) => {
          const count = (orders ?? []).filter((o: any) => o.status === key).length
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <span className={`text-[10px] font-semibold mt-1.5 px-2.5 py-0.5 rounded-full inline-block ${classes}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 border-b border-gray-100">
              <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3.5 text-left font-semibold">Order</th>
                <th className="px-5 py-3.5 text-left font-semibold">Customer</th>
                <th className="px-5 py-3.5 text-left font-semibold">Items</th>
                <th className="px-5 py-3.5 text-right font-semibold">Total</th>
                <th className="px-5 py-3.5 text-left font-semibold">Date</th>
                <th className="px-5 py-3.5 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(orders ?? []).map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">#{o.id.slice(0, 8)}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{o.customer_name || 'Walk-in'}</p>
                    {o.customer_phone && <p className="text-xs text-gray-400 mt-0.5">{o.customer_phone}</p>}
                  </td>
                  <td className="px-5 py-4 max-w-[200px]">
                    <p className="text-xs text-gray-500 truncate">
                      {o.items?.map((i: any) => {
                        const size = i.size ? ` (${i.size})` : ''
                        return `${i.product?.emoji || ''} ${i.product?.name}${size} ×${i.quantity}`
                      }).join(', ') || '—'}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-gray-900">
                    GHS {Number(o.total_amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!orders?.length && (
          <div className="text-center py-20">
            <ShoppingBag size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">Orders placed via WhatsApp will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
