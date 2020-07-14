const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  target: "web",
  mode: "development",
  entry: ['./src/index.tsx'],
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: './bundle.js'
  },
  devServer: {
    contentBase: './build'
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({configFile: './tsconfig.json'})
    ],
    extensions: [
      '.mjs',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "awesome-typescript-loader",
      },
      // {
      //   test: /\.(js|jsx|ts|tsx)$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader"
      //   }
      // },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          // {
          //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          //   loader: require.resolve('url-loader'),
          //   options: {
          //     limit: 10000,
          //     name: 'public/[name].[hash:8].[ext]',
          //   },
          // },
          {
            test: /\.(png|svg|jpg|gif|ico)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '/public/[name].[hash:8].[ext]',
                },
              }
            ],
          },
          // Compile .tsx?
          {
            test: /\.(ts|tsx)$/,
            include: '/src',
            use: [
              {
                loader: "ts-loader",
                options: {
                  // disable type checker - we will use it in fork plugin
                  transpileOnly: true,
                },
              },
            ],
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
              },
              {
                loader: require.resolve('resolve-url-loader'),
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({ flexbox: 'no-2009' }),
                  ],
                },
              },
              {
                loader: require.resolve('sass-loader'),
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      filename: "./index.html",
      favicon: './public/favicon.ico'
    }),
    new MiniCssExtractPlugin({
      filename: "./src/index.css",
    }),
    new Dotenv({
      path: path.resolve(__dirname, './.env.development')
    })
  ]
};