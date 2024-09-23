const prodConfig = require('./webpack.prod')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin() // 实例化分析插件
const {merge} = require('webpack-merge')

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

// 加入生产环境配置，和分析配置
module.exports = smp.wrap(merge(prodConfig,{
    plugins:[
        new BundleAnalyzerPlugin()
    ]
}))
