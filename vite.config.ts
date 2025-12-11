import { defineConfig, type LibraryFormats } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      react(),
      tailwindcss(),
      !isDev &&
        dts({
          include: ["src"],
          exclude: [
            "src/main.tsx",
            "src/Widget.tsx",
            "src/Widget.css",
            "src/playground.tsx",
            "src/playground/**/*",
            "src/**/*.test.ts",
            "src/**/*.test.tsx",
          ],
          tsconfigPath: "./tsconfig.build.json",
          entryRoot: "src",
          insertTypesEntry: true,
        }),
    ].filter(Boolean),
    build: isDev
      ? undefined
      : {
          outDir: "dist",
          sourcemap: true,
          minify: "esbuild" as const,
          lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "KYC_SDK",
            formats: ["es", "cjs", "iife"] as LibraryFormats[],
            fileName: format => {
              if (format === "iife") return "index.iife.js";
              if (format === "cjs") return "index.cjs";
              return "index.js";
            },
          },
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
              exports: "named" as const,
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                "react/jsx-runtime": "jsxRuntime",
              },
              assetFileNames: assetInfo => {
                if (assetInfo.name && assetInfo.name.endsWith(".css")) return "index.css";
                return assetInfo.name || "assets/[name][extname]";
              },
            },
          },
          cssCodeSplit: false,
        },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
