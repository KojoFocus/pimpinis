import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OwnerSidebar from '@/components/dashboard/OwnerSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const role = user.user_metadata?.role
  if (role !== 'owner') redirect('/')

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <OwnerSidebar />
      <div className="flex-1 bg-gray-50 p-4 md:p-8">{children}</div>
    </div>
  )
}
