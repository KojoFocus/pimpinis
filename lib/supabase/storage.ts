import { createClient } from './client'

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'product-images'

export async function uploadProductImage(file: File): Promise<string> {
  // Security checks
  if (!file) throw new Error('No file provided')
  if (file.size > 5 * 1024 * 1024) throw new Error('File size must be less than 5MB')
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed')

  const supabase = createClient()
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  if (!allowedExtensions.includes(extension)) throw new Error('Invalid file extension')

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
