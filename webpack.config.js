var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/src/main.js',
  output: {
    path: path.resolve(__dirname, './server'),
    filename: 'server.js'
  },
  mode: 'production',
  devtool: false,
  target: 'node',
  externals: [nodeExternals({
    modulesFromFile: true,
  })],
  node: {
    __dirname: false,
  },
}