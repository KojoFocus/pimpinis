import IncomeStatement from '@/components/dashboard/IncomeStatement'

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">P&L Report</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <IncomeStatement />
      </div>
    </div>
  )
}
