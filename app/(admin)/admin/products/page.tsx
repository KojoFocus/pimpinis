import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Product } from '@/types'
import { PlusCircle, Pencil, Package } from 'lucide-react'

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .order('created_at', { ascending: false })

  const products = (data as Product[]) ?? []
  const active = products.filter(p => p.is_active).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-400 text-sm mt-0.5">{active} active · {products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#1A1208] hover:bg-[#C4873A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <PlusCircle size={15} />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
              {p.images?.[0]
                ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{p.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{(p as any).category?.name} · GHS {Number(p.selling_price).toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${p.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className={`text-[10px] font-bold ${p.stock_qty === 0 ? 'text-red-500' : p.stock_qty < 5 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {p.stock_qty === 0 ? 'Out of stock' : `Stock: ${p.stock_qty}`}
                </span>
                {p.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#C4873A]/10 text-[#C4873A] font-semibold capitalize border border-[#C4873A]/20">
                    {p.badge}
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`/admin/products/${p.id}/edit`}
              className="flex-shrink-0 p-2.5 rounded-xl bg-gray-50 hover:bg-[#C4873A]/10 text-gray-400 hover:text-[#C4873A] transition-colors border border-gray-100"
            >
              <Pencil size={14} />
            </Link>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Package size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No products yet</p>
            <Link href="/admin/products/new" className="mt-3 inline-block text-sm text-[#C4873A] hover:underline font-medium">
              Add your first product →
            </Link>
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/70 border-b border-gray-100">
            <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3.5 text-left font-semibold">Product</th>
              <th className="px-5 py-3.5 text-left font-semibold">Category</th>
              <th className="px-5 py-3.5 text-right font-semibold">Price</th>
              <th className="px-5 py-3.5 text-center font-semibold">Stock</th>
              <th className="px-5 py-3.5 text-center font-semibold">Status</th>
              <th className="px-5 py-3.5 text-center font-semibold">Badge</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 leading-tight">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.description || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-sm">{(p as any).category?.name ?? '—'}</td>
                <td className="px-5 py-3.5 text-right font-bold text-gray-900">GHS {Number(p.selling_price).toFixed(2)}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`text-sm font-bold ${p.stock_qty === 0 ? 'text-red-500' : p.stock_qty < 5 ? 'text-orange-500' : 'text-gray-600'}`}>
                    {p.stock_qty}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${p.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  {p.badge
                    ? <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C4873A]/10 text-[#C4873A] capitalize border border-[#C4873A]/20">{p.badge}</span>
                    : <span className="text-gray-200 text-xs">—</span>
                  }
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C4873A] font-semibold transition-colors group-hover:text-[#C4873A]"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-20">
            <Package size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No products yet</p>
            <Link href="/admin/products/new" className="mt-3 inline-block text-sm text-[#C4873A] hover:underline font-medium">
              Add your first product →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
