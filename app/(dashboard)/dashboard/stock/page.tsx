import { createServerSupabaseClient } from '@/lib/supabase/server'
import StockForm from '@/components/dashboard/StockForm'
import type { Product, StockEntry } from '@/types'

export default async function StockPage() {
  const supabase = await createServerSupabaseClient()
  const [{ data: products }, { data: entries }] = await Promise.all([
    supabase.from('products').select('id, name').eq('is_active', true).order('name'),
    supabase.from('stock_entries').select('*, product:products(name)').order('entry_date', { ascending: false }).limit(20),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Stock Entries</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <StockForm products={(products as Product[]) ?? []} />

        <div className="bg-white rounded-xl shadow-sm p-6 overflow-auto">
          <h2 className="font-semibold text-gray-700 mb-4">Recent Entries</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-left border-b">
              <tr>
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium text-right">Cost/unit</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {((entries as StockEntry[]) ?? []).map(e => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="py-2">{e.product?.name}</td>
                  <td className="py-2 text-right">{e.quantity}</td>
                  <td className="py-2 text-right">GHS {Number(e.unit_cost).toFixed(2)}</td>
                  <td className="py-2 text-right font-medium">GHS {Number(e.total_cost).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!entries?.length && <p className="text-gray-400 text-sm mt-2">No entries yet.</p>}
        </div>
      </div>
    </div>
  )
}
