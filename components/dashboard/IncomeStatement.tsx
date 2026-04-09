'use client'
import { useState, useEffect } from 'react'
import type { IncomeStatementRow } from '@/types'

function fmt(n: number) {
  return 'GHS ' + n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Cell({ value, positive }: { value: number; positive?: boolean }) {
  const color = positive === undefined ? '' : value >= 0 ? 'text-emerald-700' : 'text-red-600'
  return <td className={`text-right py-2 px-3 tabular-nums ${color}`}>{fmt(value)}</td>
}

export default function IncomeStatement() {
  const [rows, setRows] = useState<IncomeStatementRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/finance/report')
      .then(r => r.json())
      .then(data => { setRows(data); setLoading(false) })
  }, [])

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>
  if (!rows.length) return <p className="text-sm text-gray-400">No data yet.</p>

  const totals = rows.reduce(
    (acc, r) => ({
      revenue:            acc.revenue            + r.revenue,
      cost_of_goods:      acc.cost_of_goods      + r.cost_of_goods,
      operating_expenses: acc.operating_expenses + r.operating_expenses,
      transport_costs:    acc.transport_costs    + r.transport_costs,
      gross_profit:       acc.gross_profit       + (r.gross_profit ?? 0),
      net_profit:         acc.net_profit         + (r.net_profit ?? 0),
    }),
    { revenue: 0, cost_of_goods: 0, operating_expenses: 0, transport_costs: 0, gross_profit: 0, net_profit: 0 }
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-2 px-3 font-medium">Period</th>
            <th className="text-right py-2 px-3 font-medium">Revenue</th>
            <th className="text-right py-2 px-3 font-medium">COGS</th>
            <th className="text-right py-2 px-3 font-medium">Gross Profit</th>
            <th className="text-right py-2 px-3 font-medium">Margin</th>
            <th className="text-right py-2 px-3 font-medium">Opex</th>
            <th className="text-right py-2 px-3 font-medium">Transport</th>
            <th className="text-right py-2 px-3 font-medium">Net Profit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.period} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3 text-gray-700">
                {new Date(r.period).toLocaleString('default', { month: 'short', year: 'numeric' })}
              </td>
              <Cell value={r.revenue} />
              <Cell value={r.cost_of_goods} />
              <Cell value={r.gross_profit ?? 0} positive />
              <td className="text-right py-2 px-3 tabular-nums text-gray-500">{r.gross_margin_pct?.toFixed(1)}%</td>
              <Cell value={r.operating_expenses} />
              <Cell value={r.transport_costs} />
              <Cell value={r.net_profit ?? 0} positive />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold border-t-2 bg-gray-50">
            <td className="py-2 px-3">Total</td>
            <Cell value={totals.revenue} />
            <Cell value={totals.cost_of_goods} />
            <Cell value={totals.gross_profit} positive />
            <td className="text-right py-2 px-3 tabular-nums">
              {totals.revenue > 0 ? ((totals.gross_profit / totals.revenue) * 100).toFixed(1) : 0}%
            </td>
            <Cell value={totals.operating_expenses} />
            <Cell value={totals.transport_costs} />
            <Cell value={totals.net_profit} positive />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
