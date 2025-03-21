/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "Pale-Green" : "#DBDFD0",
        "Dark-Gray": "#474747",
        "Deep-Red": "#AD343E",
        "Dark-Olive-Green": "#2C2F24",
        "Dark-Teal": "#182226",
        "Soft-Ivory":"#F9F9F7",
        "Olive-Gray": "#414536"
      },
      fontFamily: {
        playfair: ['Playfair Display','serif'],
        DM: ['DM Sans','serif']
      },
    },
  },
  plugins: [require("daisyui")],
}

