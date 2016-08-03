var path = require('path')
var webpack = require('webpack')

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
})

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    devtoolModuleFilenameTemplate: function(info){
      return "file:///"+info.absoluteResourcePath;
    }
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.sol$/, exclude: /node_modules/, loader: path.join(__dirname, './loaders/truffle-loader.js') }
    ]
  },
  plugins: [
    definePlugin
  ],
  devtool: 'source-map'
}
