const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/TinyMCE/'
    },
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', 
      filename: 'index.html',   
      inject: 'body' 
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ]
};