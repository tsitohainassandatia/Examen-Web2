/** @type {import('tailwindcss').Config} */
export default {
darkMode: 'class',
content: ['./index.html', './src/**/*.{ts,tsx}'],
theme: {
extend: {
colors: {
primary: {
DEFAULT: '#10B981', // emerald-500
dark: '#064E3B' // emerald-900
}
}
}
},
plugins: []
};