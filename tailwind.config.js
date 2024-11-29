/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'googlebluecore': '#4285F4',
				'googleredcore': '#EA4335',
				'googleyellowcore': '#FBBC04',
				'googlegreencore': '#34A853',
				'googlegreycore': '#9AA0A6',
				'googleblueG50': '#E8F0FE',
				'googleredG50': '#FCE8E6',
				'googleyellowG50': '#FEF7E0',
				'googlegreenG50': '#E6F4EA',
				'googleblueG800': '#185ABC',
				'googleredG800': '#B31412',
				'googleyellowG800': '#EA8600',
				'googlegreenG800': '#137333',
				'googlegreyG800': '#3C4043',
				'googleblueG900': '#174EA6',
				'googleredG900': '#A50E0E',
				'googleyellowG900': '#E37400',
				'googlegreenG900': '#0D652D',
				'googlegreyG900': '#202124',
			  },
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
