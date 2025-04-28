const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

// MPA 페이지 설정
const pages = [
  {
    name: 'home',
    entry: './src/pages/home/index.ts',
    template: './src/pages/home/index.html',
    filename: 'index.html',
  },
  {
    name: 'about',
    entry: './src/pages/about/index.ts',
    template: './src/pages/about/index.html',
    filename: 'about.html',
  },
  // 추가 페이지는 여기에 계속 추가
];

// 엔트리 포인트 생성
const entries = pages.reduce((config, page) => {
  config[page.name] = page.entry;
  return config;
}, {});

// HTML 웹팩 플러그인 생성
const htmlPlugins = pages.map(
  (page) =>
    new HtmlWebpackPlugin({
      template: page.template,
      filename: page.filename,
      chunks: [page.name],
      minify: !isDevelopment && {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
);

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
  },
  devtool: isDevelopment ? 'inline-source-map' : 'source-map',
  module: {
    rules: [
      // TypeScript 설정
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              logLevel: 'info',
            },
          },
        ],
        exclude: /node_modules/,
      },
      // CSS, PostCSS, SCSS 모듈 설정
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDevelopment ? '[name]__[local]--[hash:base64:5]' : '[hash:base64:8]',
              },
              sourceMap: isDevelopment,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
              sourceMap: isDevelopment,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      // 일반 CSS, SCSS 설정 (모듈이 아닌 경우)
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
              sourceMap: isDevelopment,
            },
          },
          'sass-loader',
        ],
      },
      // 이미지 설정
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/i,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'assets/images/[name].[hash][ext]',
      //   },
      // },
      // 폰트 설정
      // {
      //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'assets/fonts/[name].[hash][ext]',
      //   },
      // },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.css'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new ESLintPlugin({
      extensions: ['js', 'ts'],
      context: path.resolve(__dirname, 'src'),
      emitWarning: true,
    }),
    // 정적 파일 복사
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'src/assets',
    //       to: 'assets',
    //       globOptions: {
    //         ignore: ['**/*.scss', '**/*.css', '**/*.ts'],
    //       },
    //     },
    //   ],
    // }),
    ...htmlPlugins,
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },
};
