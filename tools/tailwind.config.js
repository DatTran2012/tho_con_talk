/* Build: cd tools && npm i tailwindcss@3.4.17 && npx tailwindcss -c tailwind.config.js -i tailwind.input.css -o ../css/tailwind.css --minify */
module.exports = {
  content: ["../index.html", "../js/**/*.js"],
  safelist: [{ pattern: /^(text|bg|border)-(emerald|amber|rose)-(300|400|500)(\/(10|40))?$/ }],
  theme: { extend: {} },
  plugins: []
};
