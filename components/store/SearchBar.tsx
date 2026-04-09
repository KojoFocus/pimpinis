'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface Props {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4873A]"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-[#C4873A] text-white rounded-lg hover:bg-[#7A4F2D] transition-colors"
      >
        Search
      </button>
    </form>
  )
}