import { createAdminClient } from '@/lib/supabase/admin'
import OrderStatusSelect from './OrderStatusSelect'
import { ShoppingBag } from 'lucide-react'

export default async function OrdersPage() {
  const supabase = createAdminClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(id, quantity, unit_price, size, product:products(name, emoji, images))')
    .order('created_at', { ascending: false })

  const total = orders?.length ?? 0
  const revenue = (orders ?? [])
    .filter((o: any) => ['confirmed','shipped','delivered'].includes(o.status))
    .reduce((s: number, o: any) => s + Number(o.total_amount), 0)
  const pending = (orders ?? []).filter((o: any) => o.status === 'pending').length

  const STATUS_STYLE: Record<string, string> = {
    pending:   'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped:   'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {total} total · {pending} pending · GHS {revenue.toFixed(2)} confirmed revenue
        </p>
      </div>

      {/* Summary pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'pending',   label: 'Pending' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'shipped',   label: 'Shipped' },
          { key: 'delivered', label: 'Delivered' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map(s => {
          const count = (orders ?? []).filter((o: any) => o.status === s.key).length
          return (
            <div key={s.key} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${STATUS_STYLE[s.key]}`}>
              <span className="text-base font-bold">{count}</span> {s.label}
            </div>
          )
        })}
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden space-y-4">
        {(orders ?? []).map((o: any) => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900">{o.customer_name || 'Walk-in'}</p>
                {o.customer_phone && <p className="text-xs text-gray-400 mt-0.5">{o.customer_phone}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold text-[#7A4F2D] font-serif">GHS {Number(o.total_amount).toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {o.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} className="w-8 h-8 rounded-lg object-cover" alt="" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-gray-800 whitespace-nowrap max-w-[120px] truncate">{item.product?.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {item.size ? `Size ${item.size} · ` : ''}×{item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status + actions */}
            <div className="pt-1 border-t border-gray-100">
              <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
            </div>
          </div>
        ))}

        {!orders?.length && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">Orders placed via WhatsApp will appear here</p>
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 border-b border-gray-100">
              <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3.5 text-left font-semibold">Order</th>
                <th className="px-5 py-3.5 text-left font-semibold">Customer</th>
                <th className="px-5 py-3.5 text-left font-semibold">Items</th>
                <th className="px-5 py-3.5 text-right font-semibold">Total</th>
                <th className="px-5 py-3.5 text-left font-semibold">Date</th>
                <th className="px-5 py-3.5 text-left font-semibold">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(orders ?? []).map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">#{o.id.slice(0,8)}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{o.customer_name || 'Walk-in'}</p>
                    {o.customer_phone && <p className="text-xs text-gray-400 mt-0.5">{o.customer_phone}</p>}
                  </td>
                  <td className="px-5 py-4 max-w-[220px]">
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
