import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

const CARD_STYLES = [
  { bg: 'bg-[#F0EAE0]', text: 'text-[#7A4F2D]', dot: 'bg-[#C4873A]' },
  { bg: 'bg-[#DAE0EC]', text: 'text-[#2E4060]', dot: 'bg-[#2E4060]' },
  { bg: 'bg-[#DAE8DA]', text: 'text-[#2E5A2E]', dot: 'bg-[#4A8A4A]' },
  { bg: 'bg-[#EAD8D8]', text: 'text-[#5A2E2E]', dot: 'bg-[#C45A5A]' },
  { bg: 'bg-[#E8DAEC]', text: 'text-[#5A2E5A]', dot: 'bg-[#9A4A9A]' },
  { bg: 'bg-[#EAE8D8]', text: 'text-[#4A4A1E]', dot: 'bg-[#8A8A2E]' },
  { bg: 'bg-[#D8EAE8]', text: 'text-[#1E4A4A]', dot: 'bg-[#2E8A8A]' },
]

export default function CategoryGrid() {
  return (
    <section className="py-10 px-4 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C4873A] font-semibold mb-1">Browse</p>
            <h2 className="font-serif text-2xl text-[#1A1208]">Shop by Category</h2>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 sm:grid sm:grid-cols-4 md:grid-cols-7">
          {CATEGORIES.map((cat, idx) => {
            const style = CARD_STYLES[idx % CARD_STYLES.length]
            return (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`flex-shrink-0 ${style.bg} group flex flex-col items-center justify-center gap-2.5 rounded-2xl py-6 px-3 min-w-[96px] sm:min-w-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
              >
                <span className="text-3xl leading-none group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </span>
                <span className={`text-xs font-bold ${style.text} text-center leading-tight tracking-wide`}>
                  {cat.name}
                </span>
                <span className={`w-4 h-0.5 rounded-full ${style.dot} opacity-50 group-hover:opacity-100 group-hover:w-6 transition-all duration-200`} />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
