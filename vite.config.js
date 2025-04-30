import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { createHtmlPlugin } from "vite-plugin-html";
import { globby } from "globby";

// 페이지 디렉토리 경로
const pagesDir = resolve(__dirname, "src/pages");

// 페이지 디렉토리에서 모든 폴더 찾기
const pages = fs.readdirSync(pagesDir).filter((file) => {
  return fs.statSync(resolve(pagesDir, file)).isDirectory();
});

// 각 페이지에 대한 엔트리 포인트 구성
const input = {};

pages.forEach((page) => {
  input[page] = resolve(pagesDir, page, "index.html");
});

export default defineConfig(async () => {
  // globby를 사용하여 모든 HTML 파일 찾기
  const htmlPaths = await globby("src/pages/**/index.html");

  // 공통 head 파일 읽기
  const commonHeadPath = resolve(__dirname, "src/includes/common-head.html");

  const commonHead = fs.readFileSync(commonHeadPath, "utf-8");

  return {
    plugins: [ViteMinifyPlugin(), createHtmlPlugin({ minify: false, pages: [
      { entry: "/src/pages/home/index.ts", filename: "index.html", template: "/src/pages/home/index.html", injectOptions: { data: { commonHead: commonHead } } },
      { entry: "/src/pages/about/index.ts", filename: "index.html", template: "/src/pages/about/index.html" },
      { entry: "/src/pages/contact/index.ts", filename: "index.html", template: "/src/pages/contact/index.html" }
    ] })],
    appType: "mpa",
    build: {
      outDir: "./dist",
      emptyOutDir: true,
      rollupOptions: {
        input,
        output: {
          // 각 페이지마다 독립적인 chunk 생성
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  };
});
