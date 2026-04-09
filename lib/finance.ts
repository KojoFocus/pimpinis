import type { IncomeStatementRow } from '@/types'

export function computeIncomeStatement(raw: IncomeStatementRow[]): IncomeStatementRow[] {
  return raw.map((row) => {
    const grossProfit = row.revenue - row.cost_of_goods
    const netProfit = grossProfit - row.operating_expenses - row.transport_costs
    const grossMarginPct = row.revenue > 0 ? (grossProfit / row.revenue) * 100 : 0
    return {
      ...row,
      gross_profit: grossProfit,
      net_profit: netProfit,
      gross_margin_pct: Math.round(grossMarginPct * 10) / 10,
    }
  })
}

export const EXPENDITURE_CATEGORIES = [
  'Rent', 'Salaries', 'Packaging', 'Marketing',
  'Utilities', 'Equipment', 'Miscellaneous',
]
