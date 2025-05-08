import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { createHtmlPlugin } from "vite-plugin-html";

// 페이지 디렉토리 경로
const pagesDir = resolve(__dirname, "src/pages");

// 페이지 디렉토리에서 모든 폴더 찾기
const pages = fs.readdirSync(pagesDir).filter((file) => {
  return fs.statSync(resolve(pagesDir, file)).isDirectory();
});

// 각 페이지에 대한 엔트리 포인트 구성
const input = {
  commonEntry: resolve(__dirname, "src/includes/common-entry.ts"),
};

pages.forEach((page) => {
  input[page] = resolve(pagesDir, page, "index.html");
});

export default defineConfig(async () => {
  // 공통 head 파일 읽기
  const commonHeadPath = resolve(__dirname, "src/includes/common-head.html");

  const commonHead = fs.readFileSync(commonHeadPath, "utf-8");

  return {
    plugins: [
      ViteMinifyPlugin(),
      createHtmlPlugin({
        minify: true,
        pages: [
          {
            entry: "/src/pages/main/index.ts",
            filename: "main.html",
            template: "/src/pages/main/index.html",
            injectOptions: { data: { commonHead: commonHead } },
          },
          {
            entry: "/src/pages/home/index.ts",
            filename: "home.html",
            template: "/src/pages/home/index.html",
            injectOptions: { data: { commonHead: commonHead } },
          },
          {
            entry: "/src/pages/about/index.ts",
            filename: "about.html",
            template: "/src/pages/about/index.html",
            injectOptions: { data: { commonHead: commonHead } },
          },
          {
            entry: "/src/pages/contact/index.ts",
            filename: "contact.html",
            template: "/src/pages/contact/index.html",
            injectOptions: { data: { commonHead: commonHead } },
          },
        ],
      }),
      {
        name: "remove-src-dir-from-html-path",
        enforce: "post",
        generateBundle(_, bundle) {
          const htmlFileInSrcFolderPattern = /^src\/.*\.html$/;
          for (const outputItem of Object.values(bundle)) {
            if (!htmlFileInSrcFolderPattern.test(outputItem.fileName)) {
              continue;
            }
            if (outputItem.fileName.startsWith("src/pages/main")) {
              outputItem.fileName = outputItem.fileName.replace(
                "src/pages/main/",
                ""
              );
            } else {
              outputItem.fileName = outputItem.fileName.replace(
                "src/pages/",
                ""
              );
            }
          }
        },
      },
      {
        name: "rewrite-middleware",
        configureServer(serve) {
          serve.middlewares.use((req, _res, next) => {
            if (req.url?.startsWith("/home")) {
              req.url = "/src/pages/home/index.html";
            }
            if (req.url?.startsWith("/about")) {
              req.url = "/src/pages/about/index.html";
            }
            if (req.url?.startsWith("/contact")) {
              req.url = "/src/pages/contact/index.html";
            }
            if (req.url === "/index.html") {
              req.url = "/src/pages/main/index.html";
            }
            next();
          });
        },
      },
    ],
    appType: "mpa",
    build: {
      input: input,
      outDir: "./dist",
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
            if (id.includes("common-entry.ts")) {
              return "common";
            }
          },
          assetFileNames: (assetInfo) => {
            // 이미지 파일인 경우 원래 경로 구조 유지
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
              return "assets/images/[name].[hash][extname]";
            }
            // 폰트 파일인 경우
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
              return "assets/fonts/[name].[hash][extname]";
            }
            // 기타 에셋
            return "assets/[name].[hash][extname]";
          },
        },
      },
      css: {
        devSourcemap: false,
        preprocessorOptions: {
          scss: {},
        },
        url: {
          filter: (url) => !url.startsWith("/"), // 절대 경로 아닌 경우만 처리
        },
      },
      assetsInclude: [
        "**/*.svg",
        "**/*.png",
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.gif",
      ],
      build: {
        assetsInlineLimit: 4096, // 4kb 이하는 인라인화, 그 이상은 파일로
      },
    },
  };
});
