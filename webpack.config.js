const webpack = require('webpack');
const htmlWebpackPlugin = require("html-webpack-plugin");
const Happypack = require('happypack');
const { resolve, join } = require('path');
const os = require('os');

const happypackPool = Happypack.ThreadPool({ size: os.cpus().length });
const plugins = [
  new Happypack({
    id: 'js',
    threads: 3,
    // verbose: true,
    verbose: false,
    loaders: ['babel-loader'],
    threadPool: happypackPool,
    debug: false,
  }),
  // new Happypack({
  //   id: 'ts',
  //   loaders: ['ts-loader'],
  //   threadPool: happypackPool,
  // }),
  new Happypack({
    id: 'css',
    loaders: ['style-loader', 'css-loader'],
    threadPool: happypackPool,
  }),
  new Happypack({
    id: 'sass',
    loaders: ['style-loader', 'css-loader', 'sass-loader'],
    threadPool: happypackPool,
  }),
  new Happypack({
    id: 'file',
    loaders: ['file-loader'],
    threadPool: happypackPool,
  }),
];

module.exports =  {
  entry: {
    index: './index.ts',
  },
  output: {
    path: resolve('dist'),
    filename: 'common.js',
  },
  devServer: {
    contentBase: './src',
    port: 3000,
    hot: true,
    host: 'localhost',
    open: true,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['happypack/loader?id=js'],
        exclude: /node_module/,
      },
      {
        test: /\.ts$/,
        // use: ['happypack/loader?id=ts'],
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_module/,
      },
      {
        test: /\.css$/,
        use: ['happypack/loader?id=css'],
      },
      {
        test: /\.scss$/,
        use: ['happypack/loader?id=sass'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['happypack/loader?id=file'],
      },
    ]
  },
  plugins: [
		new htmlWebpackPlugin({
			template: join(__dirname, './index.html'),
			filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    ...plugins,
	],
}