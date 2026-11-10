import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
			},
			colors: {
				googlebluecore: '#4285F4',
				googleredcore: '#EA4335',
				googleyellowcore: '#FBBC04',
				googlegreencore: '#34A853',
				googlegreycore: '#9AA0A6',
				googleblue600: '#1A73E8',
				googleblue700: '#1557B0',
				googleblue300: '#8AB4F8',
				googleblue200: '#AECBFA',
				googleblueG50: '#E8F0FE',
				googleredG50: '#FCE8E6',
				googleyellowG50: '#FEF7E0',
				googlegreenG50: '#E6F4EA',
				googlegreyG50: '#F8F9FA',
				googlegreyG100: '#F1F3F4',
				googlegreyG200: '#E8EAED',
				googlegreyG300: '#DADCE0',
				googlegreyG600: '#80868B',
				googlegreyG700: '#5F6368',
				googleblueG800: '#185ABC',
				googleredG800: '#B31412',
				googleyellowG800: '#EA8600',
				googlegreenG800: '#137333',
				googlegreyG800: '#3C4043',
				googleblueG900: '#174EA6',
				googleredG900: '#A50E0E',
				googleyellowG900: '#E37400',
				googlegreenG900: '#0D652D',
				googlegreyG900: '#202124',
				googledarkcard: '#292A2D',
				googledarktonal: '#303134'
			}
		}
	},
	plugins: [forms]
};
