const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const AppcachePlugin = require('./build-tools/webpack-appcache-manifest.js');

const TARGET = process.env.npm_lifecycle_event;
const CLIOPTIONS = process.argv;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

var exports = {};


const common = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      //{ test: /\.jsx?$/,
      //  loader: 'babel-loader',
      //  query: {
      //    presets: ['es2015', 'stage-0'],
      //  }}
    ]
  }
};

var exports = merge(common, {});

if(TARGET === 'devserver' || TARGET === 'build' || TARGET === 'full-build') {
  exports = merge(exports, {
    module: {
      loaders: [
        {
          test: /\.scss|\.css$/,
          loader: 'style!css!sass?includePaths[]=./node_modules/material-design-lite/src'
        }
      ]
  }
  })
}

if( TARGET === 'testserver' ) {
  exports = merge(exports, {
    module: {
      loaders: [
         {
            test: /(\.css|\.less|\.scss)$/,
            loader: 'null-loader',
            exclude: [
                /build/
            ]
          }
      ]
    }
  })
}

// Default configuration
if(TARGET === 'devserver' || TARGET === 'testserver' || !TARGET) {
  exports = merge(exports, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      // if not cloud 9:
      //   host: process.env.HOST,
      // if cloud 9:
      //   host: process.env.HOST || '0.0.0.0',
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      }),
      new webpack.DefinePlugin({
        // Sets logging and testing configs
        // In source code write: if (config.loggingMode == true) { ... }
        'config.loggingMode': JSON.stringify((CLIOPTIONS.indexOf('--devlog') > -1)),
        'config.testingMode': JSON.stringify((CLIOPTIONS.indexOf('--devtest') > -1))
      })
    ]
  });
}




if(TARGET === 'build' || TARGET === 'full-build') {
  exports = merge(exports, {
    plugins: [
      new webpack.DefinePlugin({
        // Sets logging and testing configs
        // In source code write: if (config.loggingMode == true) { ... }
        'config.loggingMode': JSON.stringify(false),
        'config.testingMode': JSON.stringify(false)
      }),
      //new webpack.optimize.UglifyJsPlugin({
      //  compress: {
      //    warnings: false
      //  }
      //}),
      new AppcachePlugin({
        directory: './build',
        filter: ['manifest.appcache', '*.md'],  // example: ['foo.css', '*.md']
        version: '1.0',
        filename: 'manifest.appcache'
      })
    ]
  });
}

module.exports = exports;