/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:      "#FAFBFF",
        secondaryBg:     "#F1F4FB",
        cardBg:          "#FFFFFF",
        cardBorder:      "#E5E9F2",
        primaryText:     "#1E2433",
        secondaryText:   "#6B7280",
        primaryAccent:   "#6366F1", // Indigo
        secondaryAccent: "#8B5CF6", // Violet
        tertiaryAccent:  "#06B6D4", // Cyan
        success:         "#10B981", // Emerald
        warning:         "#F59E0B", // Amber
        danger:          "#EF4444", // Red
        highlightGlow:   "#F472B6", // Pink
      },
      borderRadius: {
        'lg':  '16px',
        'xl':  '20px',
        'md':  '12px',
        'sm':  '8px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        heading: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        'sm':  '0 2px 8px -2px rgba(99,102,241,0.05)',
        'md':  '0 4px 20px -4px rgba(99,102,241,0.08), 0 2px 8px -2px rgba(99,102,241,0.04)',
        'lg':  '0 10px 30px -10px rgba(99,102,241,0.12), 0 4px 12px -4px rgba(99,102,241,0.06)',
        'xl':  '0 20px 50px -12px rgba(99,102,241,0.18)',
        'glow':'0 0 20px rgba(99,102,241,0.25)',
      },
      animation: {
        'fade-in':     'fade-in 0.35s ease both',
        'slide-in':    'slide-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up':    'slide-up 0.35s ease both',
        'scale-in':    'scale-in 0.25s ease both',
        'spin-slow':   'spin 2s linear infinite',
        'blink-dot':   'blink-dot 1.2s ease infinite',
        'pulse-slow':  'pulse-slow 4s ease-in-out infinite',
        'float':       'float 3s ease-in-out infinite',
        'shimmer':     'shimmer 1.5s infinite',
      },
      keyframes: {
        'fade-in':  { from: { opacity:'0', transform:'translateY(6px)'  }, to: { opacity:'1', transform:'translateY(0)'  }},
        'slide-in': { from: { opacity:'0', transform:'translateX(40px)' }, to: { opacity:'1', transform:'translateX(0)' }},
        'slide-up': { from: { opacity:'0', transform:'translateY(20px)' }, to: { opacity:'1', transform:'translateY(0)' }},
        'scale-in': { from: { opacity:'0', transform:'scale(0.92)'      }, to: { opacity:'1', transform:'scale(1)'      }},
        'float':    { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-6px)' }},
        'pulse-slow':{ '0%,100%': { opacity:'0.6', transform:'scale(1)' }, '50%': { opacity:'0.9', transform:'scale(1.05)' }},
        'blink-dot':{ '0%,100%': { opacity:'1' }, '50%': { opacity:'0' }},
        'shimmer':  { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' }},
      },
    },
  },
  plugins: [],
}
