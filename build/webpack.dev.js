const path = require('path');
const {merge} = require('webpack-merge')
const baseConfig = require('./webpack.base')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

// 合并公共配置，添加开发环境配置
module.exports = merge(baseConfig, {
    mode: 'development', // 开发模式，加速打包
    devtool: 'eval-cheap-module-source-map', // 源码调试结构
    plugins:[
        new ReactRefreshWebpackPlugin(), // 添加热更新插件
    ],
    devServer:{ // 服务器配置
        port: 3000, // 服务端口号
        compress: false, // gzip压缩
        hot: true, // 开启热更新
        historyApiFallback: true, //
        static:{
            directory: path.join(__dirname, "../public") // 托管静态资源public文件夹
        }
    }
})
