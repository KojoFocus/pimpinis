import { createAdminClient } from '@/lib/supabase/admin'
import { StockForm as StockAdjustmentForm } from '@/components/dashboard/StockAdjustmentForm'

export default async function StockPage() {
  const supabase = createAdminClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, stock_qty, emoji, price')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
        <p className="text-gray-600">Monitor and adjust product inventory levels</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Current Stock Levels</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {products?.map((product) => (
            <div key={product.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{product.emoji}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">₦{product.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Stock</p>
                  <p className={`font-semibold ${product.stock_qty < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stock_qty} units
                  </p>
                </div>

                <StockAdjustmentForm product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}