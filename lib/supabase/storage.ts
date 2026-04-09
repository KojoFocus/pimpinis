import { createClient } from './client'

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'product-images'

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient()
  const extension = file.name.split('.').pop() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`
  const filePath = `products/${filename}`

  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw new Error(error.message)
  if (!data?.path) throw new Error('Upload failed')

  const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data.path)
  if (!urlData?.publicUrl) throw new Error('Could not get public URL for uploaded image.')

  return urlData.publicUrl
}
