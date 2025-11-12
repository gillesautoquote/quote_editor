module.exports = {
	prefix: 'tw-',
	darkMode: 'class',
	corePlugins: { preflight: true },
	content: ['./src/**/*.{js,jsx,ts,tsx}'], // ⬅ enlève ./public/index.html
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#2563eb',
					hover: '#1d4ed8',
				},
				secondary: {
					DEFAULT: '#475569',
				},
				success: {
					DEFAULT: '#10b981',
				},
				warning: {
					DEFAULT: '#f59e0b',
				},
				danger: {
					DEFAULT: '#ef4444',
				},
				info: {
					DEFAULT: '#0ea5e9',
				},
				light: {
					DEFAULT: '#f8fafc',
				},
				dark: {
					bg: {
						primary: '#0f172a',
						secondary: '#1e293b',
						tertiary: '#334155',
					},
					text: {
						primary: '#e2e8f0',
						secondary: '#94a3b8',
						tertiary: '#64748b',
					},
					border: '#334155',
					highlight: '#3b82f6',
				},
			},
			boxShadow: {
				'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
				'md': '0 4px 6px rgba(0, 0, 0, 0.07)',
				'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
				'dark-sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
				'dark-md': '0 4px 6px rgba(0, 0, 0, 0.4)',
				'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.5)',
			},
			borderRadius: {
				'md': '0.5rem',
			},
			transitionDuration: {
				'fast': '150ms',
			},
		},
	},
	plugins: []
};