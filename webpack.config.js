const { resolve } = require('path');
module.exports =  {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  output: {
    path: resolve('dist'),
    filename: 'common.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: ['babel-loader'],
        exclude: /node_module/,
      },
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_module/,
      },
    ]
  },
}