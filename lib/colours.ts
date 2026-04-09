export const FASHION_COLOURS: Record<string, string> = {
  // Basics
  black: '#111111', white: '#f5f5f0', grey: '#9ca3af', gray: '#9ca3af',
  // Reds & pinks
  red: '#e53e3e', crimson: '#dc143c', scarlet: '#ff2400', burgundy: '#800020',
  maroon: '#800000', wine: '#722f37', rose: '#ff007f', blush: '#f4a7b9',
  coral: '#ff6b6b', salmon: '#fa8072', pink: '#ec4899', hotpink: '#ff69b4',
  fuchsia: '#ff00ff', magenta: '#ff00cc',
  // Purples & mauves
  mauve: '#c8a2c8', lavender: '#b57edc', purple: '#a855f7', violet: '#8b00ff',
  plum: '#8e4585', lilac: '#c8a2c8', orchid: '#da70d6', mulberry: '#c54b8c',
  // Blues
  blue: '#3b82f6', navy: '#1e3a5f', royal: '#4169e1', cobalt: '#0047ab',
  teal: '#008080', turquoise: '#40e0d0', cyan: '#00bcd4', aqua: '#00ffff',
  periwinkle: '#ccccff', denim: '#1560bd', steel: '#4682b4', powder: '#b0e0e6',
  // Greens
  green: '#22c55e', olive: '#808000', sage: '#87ae73', mint: '#98ff98',
  emerald: '#50c878', forest: '#228b22', lime: '#84cc16', khaki: '#c3b091',
  // Yellows & oranges
  yellow: '#eab308', gold: '#c8961e', amber: '#f59e0b', mustard: '#e1ad01',
  orange: '#f97316', peach: '#ffcba4', apricot: '#fbceb1', tangerine: '#f28500',
  // Browns & neutrals
  brown: '#7c4f2e', tan: '#d2b48c', camel: '#c19a6b', chocolate: '#7b3f00',
  coffee: '#6f4e37', mocha: '#967969', taupe: '#8b7355', nude: '#e8c99a',
  cream: '#fffdd0', ivory: '#fffff0', beige: '#d4b896', linen: '#faf0e6',
  sand: '#c2b280', champagne: '#f7e7ce',
  // Metallics
  silver: '#b0b8c1', bronze: '#cd7f32', copper: '#b87333',
}

/** Resolve a colour name/value to a hex string for display. Falls back to '#d1d5db'. */
export function swatchColor(colour: string): string {
  if (!colour.trim()) return '#d1d5db'
  const key = colour.trim().toLowerCase()
  if (FASHION_COLOURS[key]) return FASHION_COLOURS[key]
  // Try as a raw CSS value (hex, rgb, hsl, or any extended CSS named colour)
  if (typeof document !== 'undefined') {
    try {
      const el = document.createElement('div')
      el.style.color = colour
      document.body.appendChild(el)
      const computed = window.getComputedStyle(el).color
      document.body.removeChild(el)
      if (computed && computed !== 'rgba(0, 0, 0, 0)') {
        const m = computed.match(/\d+/g)
        if (m && m.length >= 3) {
          const [r, g, b] = m.map(Number)
          return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
        }
      }
    } catch { /* fall through */ }
  }
  return '#d1d5db'
}
