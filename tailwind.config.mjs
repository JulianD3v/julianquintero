/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

const rgb = (variable) => `rgb(var(${variable}) / <alpha-value>)`

/** Utilidades de OpenType features: ligaduras de código y números tabulares. */
const openType = plugin(({ addUtilities }) => {
	addUtilities({
		'.font-ligatures-code': {
			'font-feature-settings': '"liga" 1, "calt" 1, "ss01" 1',
			'font-variant-ligatures': 'common-ligatures contextual',
		},
		'.font-tnum': { 'font-variant-numeric': 'tabular-nums' },
		'.font-lining': { 'font-variant-numeric': 'lining-nums tabular-nums' },
	})
})

/**
 * Texto enriquecido vindo de `site.ts` (about, experiencia, decisiones).
 * Se declara aquí en vez de con variantes arbitrarias `[&>strong]` porque
 * el `>` confunde al parser de Astro en los `.astro`.
 */
const richText = plugin(({ addUtilities }) => {
	addUtilities({
		'.text-rich': {
			'& > strong': { 'font-weight': '600', color: rgb('--c-fg') },
			'& > em': { 'font-style': 'normal', color: rgb('--c-fg') },
			'& > a': {
				color: rgb('--c-accent'),
				'text-decoration-line': 'underline',
				'text-underline-offset': '3px',
			},
			'& > code': {
				'font-family': 'theme(fontFamily.mono)',
				'font-size': '0.9em',
			},
		},
	})
})

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				bg: rgb('--c-bg'),
				'bg-soft': rgb('--c-bg-soft'),
				surface: rgb('--c-surface'),
				fg: rgb('--c-fg'),
				muted: rgb('--c-muted'),
				line: rgb('--c-line'),
				accent: rgb('--c-accent'),
				'accent-contrast': rgb('--c-accent-contrast'),
			},
			fontFamily: {
				display: ['"Syne Variable"', '"Fallback-Display"', 'system-ui', 'sans-serif'],
				sans: ['"Onest Variable"', '"Fallback-Sans"', 'system-ui', 'sans-serif'],
				mono: ['"JetBrains Mono Variable"', '"Fallback-Mono"', 'ui-monospace', 'monospace'],
			},
			fontSize: {
				'display-sm': ['clamp(1.9rem, 4.6vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
				'display': ['clamp(2.2rem, 5.6vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
				'fluid-h1': ['clamp(2.5rem, 6vw + 1rem, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
				'fluid-h2': ['clamp(2rem, 4vw + 1rem, 3.75rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
				'fluid-body': ['clamp(1rem, 0.5vw + 0.9rem, 1.2rem)', { lineHeight: '1.65' }],
			},
			transitionTimingFunction: {
				swift: 'cubic-bezier(0.22, 1, 0.36, 1)',
			},
			keyframes: {
				'pulse-dot': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(0.55)', opacity: '0.4' },
				},
			},
			animation: {
				'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
			},
		},
	},
	plugins: [openType, richText],
}
