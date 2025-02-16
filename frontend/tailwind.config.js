/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [
    require('daisyui'),
    plugin (function({ addBase, addComponents }){
      addBase({});
      addComponents({
        ".animate": {
          "@apply duration-300 ease-in-out": {},
        },
      });
    })
    
  ],
  daisyui: {
    themes: ["light"], // Force le thème clair
  }

}

