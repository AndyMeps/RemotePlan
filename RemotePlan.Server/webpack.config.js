const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RemotePlan',
      template: 'src/content/index.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@atoms': path.resolve(__dirname, 'src/atoms/'),
      '@molecules': path.resolve(__dirname, 'src/molecules/'),
      '@views': path.resolve(__dirname, 'src/views/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@contexts': path.resolve(__dirname, 'src/contexts/')
    }
  },
  output: {
    filename: 'js/main.js',
    path: path.resolve(__dirname, 'wwwroot'),
    clean: true,
    publicPath: '/'
  },
};