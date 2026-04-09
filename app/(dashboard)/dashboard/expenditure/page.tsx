import { createServerSupabaseClient } from '@/lib/supabase/server'
import ExpenditureForm from '@/components/dashboard/ExpenditureForm'
import type { Expenditure } from '@/types'

export default async function ExpenditurePage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('expenditures')
    .select('*')
    .order('expense_date', { ascending: false })
    .limit(20)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Expenditures</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <ExpenditureForm />
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-auto">
          <h2 className="font-semibold text-gray-700 mb-4">Recent Expenses</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-left border-b">
              <tr>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium text-right">Amount</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {((data as Expenditure[]) ?? []).map(e => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="py-2 text-gray-600">{e.category}</td>
                  <td className="py-2 text-gray-500 max-w-[120px] truncate">{e.description}</td>
                  <td className="py-2 text-right font-medium">GHS {Number(e.amount).toFixed(2)}</td>
                  <td className="py-2 text-gray-400">{e.expense_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.length && <p className="text-gray-400 text-sm mt-2">No expenses yet.</p>}
        </div>
      </div>
    </div>
  )
}
