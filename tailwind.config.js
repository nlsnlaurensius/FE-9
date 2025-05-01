/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      // Tambahkan warna custom jika perlu, sesuaikan dengan gambar inspirasi
      colors: {
         // Contoh warna dari gambar inspirasi (kuning/jingga dan biru)
         primary: '#ff9800', // Warna utama (mirip kuning/jingga)
         secondary: '#2196f3', // Warna sekunder (birip biru)
         // Sesuaikan warna lain jika diperlukan
      }
    },
  },
  plugins: [],
}