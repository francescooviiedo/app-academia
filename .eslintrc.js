module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-unused-expressions": "warn",
  },
  ignorePatterns: [
    "public/**/*",
    "public/sw.js",
    "public/workbox-*.js",
    "node_modules/",
    ".next/",
  ],
};
