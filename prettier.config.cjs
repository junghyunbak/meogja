/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  "plugins": ["prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.svg",
      "options": {
        "parser": "html"
      }
    }
  ]
}

module.exports = config