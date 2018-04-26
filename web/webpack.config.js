const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
}

module.exports = (env) => {
  const isProduction = env === 'production';
  const CSSExtract = new ExtractTextPlugin('styles.[contenthash].css');

  return {
    entry: {
      main: ['babel-polyfill', './src/app.js'],
      vendor: [
        'babel-polyfill',
        'apollo-cache-inmemory',
        'apollo-client',
        'apollo-link',
        'apollo-link-error',
        'apollo-link-http',
        'graphql',
        'graphql-tag',
        'material-ui',
        'material-ui-icons',
        'moment',
        'numeral',
        'prop-types',
        'react',
        'react-addons-shallow-compare',
        'react-apollo',
        'react-dom',
        'react-modal',
        'react-redux',
        'react-router-dom',
        'recompose',
        'redux',
        'redux-persist',
        'redux-thunk',
        'uuid',
        'validator',
      ],
    },
    plugins: [
      CSSExtract,
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        template: 'template.html',
      }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //  name: 'manifest'
      // }),
      // dump all files in static directly into the build root
      new CopyWebpackPlugin([{ from: 'static', to: '.' }]),
    ],
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.js$/,
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          use: CSSExtract.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ],
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      // contentBase: path.join(__dirname, 'dist'),
      historyApiFallback: true,
      port: 5000,
    },
    stats: {
      // Add errors
      errors: true,
      // Add details to errors (like resolving log)
      errorDetails: true,
    },
  };
};
