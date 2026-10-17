import tseslint from "typescript-eslint";
const files = [
  "lib/wallace-index/**/*.ts",
  "components/wallace-index/**/*.tsx",
  "app/wallace-index/**/*.tsx",
  "app/api/wallace-index/**/*.ts",
  "app/desk/wallace-index/**/*.tsx",
  "auth.ts",
  "scripts/wallace-*.ts",
];
export default tseslint.config(
  ...tseslint.configs.recommended.map((config) => ({ ...config, files })),
  {
    files,
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
);
