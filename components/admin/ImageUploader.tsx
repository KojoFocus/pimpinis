'use client'
import { useState } from 'react'
import { uploadProductImage } from '@/lib/supabase/storage'

interface Props {
  images: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)

    try {
      const urls = await Promise.all(files.map(uploadProductImage))
      onChange([...images, ...urls])
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map(url => (
          <div key={url} className="relative w-24 h-24 rounded overflow-hidden border">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter(u => u !== url))}
              className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="block cursor-pointer border-2 border-dashed rounded-lg px-4 py-3 text-sm text-center text-gray-500 hover:border-gray-400 transition">
        {uploading ? 'Uploading…' : '+ Add images'}
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
      </label>
    </div>
  )
}
