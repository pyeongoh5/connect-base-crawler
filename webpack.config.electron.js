const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: "./electron/main.js", //빌드할 javascript 파일
  output: {
    filename: "electron.js", //변환한 javascript 파일
    path: path.resolve(__dirname + "/public") // output 결과물 빌드 위치
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [ //각각 javascript, html, css 빌드할 규칙
        {
            test: /\.(js|jsx)$/,
            exclude: "/node_modules",
            use: ['babel-loader'],
        },
    ]
  },
  node: {
    __dirname: false, // Use node.js __dirname
  },
  externals: [nodeExternals()],
  target: 'electron-main',
};