import Navbar from '@/components/store/Navbar'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-[#1A1208] text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-[1.8fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="text-2xl font-serif tracking-[0.15em]">Pimpinis</div>
            <p className="text-sm text-[#D9C9B5] max-w-lg leading-7">
              Your premium fashion destination in Accra — curated dresses, footwear, sunglasses, accessories and more. Shop with confidence and enjoy fast WhatsApp ordering.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/233240395127"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-[#1A1208] px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-[#1ecb5b] transition-colors"
              >
                WhatsApp Us
              </a>
              <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm text-[#F0EAE0]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#C4873A]" /> Open 8am – 8pm
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-[0.2em] text-[#D9C9B5] mb-5">Shop</h2>
            <ul className="space-y-3 text-sm text-[#E9DECE]">
              <li><a href="/shop?category=dresses" className="hover:text-white transition-colors">Dresses</a></li>
              <li><a href="/shop?category=footwear" className="hover:text-white transition-colors">Footwear</a></li>
              <li><a href="/shop?category=sunglasses" className="hover:text-white transition-colors">Sunglasses</a></li>
              <li><a href="/shop?category=accessories" className="hover:text-white transition-colors">Accessories</a></li>
              <li><a href="/shop?category=hats" className="hover:text-white transition-colors">Hats</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-[0.2em] text-[#D9C9B5] mb-5">Contact</h2>
            <div className="space-y-4 text-sm text-[#E9DECE]">
              <div>
                <p className="font-semibold text-white">WhatsApp</p>
                <a href="https://wa.me/233240395127" className="hover:text-white transition-colors">+233 240 395 127</a>
              </div>
              <div>
                <p className="font-semibold text-white">Email</p>
                <a href="mailto:hello@pimpinis.com" className="hover:text-white transition-colors">hello@pimpinis.com</a>
              </div>
              <div>
                <p className="font-semibold text-white">Location</p>
                <p className="text-[#D9C9B5]">Accra, Ghana</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4 md:flex-row items-center justify-between text-xs text-[#B8A98A]">
            <p>© {new Date().getFullYear()} Pimpinis. All rights reserved.</p>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="bg-white/10 px-3 py-2 rounded-full">MTN MoMo</span>
              <span className="bg-white/10 px-3 py-2 rounded-full">Vodafone Cash</span>
              <span className="bg-white/10 px-3 py-2 rounded-full">Visa</span>
              <span className="bg-white/10 px-3 py-2 rounded-full">Cash</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
