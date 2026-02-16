import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			backgroundImage: {
				'linear-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
				'linear-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
				'linear-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
				'linear-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
				'linear-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
				'linear-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
				'linear-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
				'linear-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
					'50%': { transform: 'translateY(-40px) translateX(15px)' }
				},
				floatSlow: {
					'0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
					'50%': { transform: 'translateY(-50px) translateX(25px)' }
				},
				floatReverse: {
					'0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
					'50%': { transform: 'translateY(45px) translateX(-20px)' }
				},
				bounceSoft: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				tick: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(3deg)' },
					'75%': { transform: 'rotate(-3deg)' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '.7' }
				},
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				}
			},
			animation: {
				float: 'float 4s ease-in-out infinite',
				floatSlow: 'floatSlow 5s ease-in-out infinite',
				floatReverse: 'floatReverse 4.5s ease-in-out infinite',
				bounceSoft: 'bounceSoft 2s ease-in-out infinite',
				tick: 'tick 1.5s ease-in-out infinite',
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				spinSlow: 'spin 8s linear infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
