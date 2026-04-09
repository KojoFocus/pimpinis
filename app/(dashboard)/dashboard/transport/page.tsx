import { createServerSupabaseClient } from '@/lib/supabase/server'
import TransportForm from '@/components/dashboard/TransportForm'
import type { TransportCost } from '@/types'

export default async function TransportPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('transport_costs')
    .select('*')
    .order('transport_date', { ascending: false })
    .limit(20)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transport Costs</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <TransportForm />
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-auto">
          <h2 className="font-semibold text-gray-700 mb-4">Recent Costs</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-left border-b">
              <tr>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium text-right">Amount</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {((data as TransportCost[]) ?? []).map(t => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2 text-gray-700 max-w-[180px] truncate">{t.description}</td>
                  <td className="py-2 text-right font-medium">GHS {Number(t.amount).toFixed(2)}</td>
                  <td className="py-2 text-gray-400">{t.transport_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.length && <p className="text-gray-400 text-sm mt-2">No transport costs yet.</p>}
        </div>
      </div>
    </div>
  )
}
