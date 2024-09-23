const path = require('path');
const {merge} = require('webpack-merge')
const baseConfig = require('./webpack.base')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const {PurgeCSSPlugin} = require('purgecss-webpack-plugin')
const globAll = require('glob-all')
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(baseConfig, {
    mode:'production',// 开启生产环境
    plugins:[
        // 复制文件插件
        new CopyPlugin({
            patterns:[
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist/public'),
                    filter: source => {
                        return !source.includes('index.html')
                    }
                }
            ]
        }),

        // 抽离css插件
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css'
        }),

        // 清理无用css
        new PurgeCSSPlugin({
            // 检测src下所有tsx文件和public下index.html中使用到的类名、id、标签
            //只打包这些文件中用到的样式
            paths: globAll.sync([
                `${path.join(__dirname,'../src')}/**/*.tsx`,
                path.join(__dirname,'../public/index.html')
            ]),

            // 自定义白名单
            safelist:{
                standard:[/^ant-/], // 过滤以ant-开头的类名
            }
        }),

        // 打包压缩配置
        new CompressionPlugin({
            test: /.(js|css)$/, // 只生成css、js的压缩文件
            filename:'[path][base].gz', // 文件命名
            algorithm: 'gzip', // 压缩格式
            threshold: 10240, // 最小压缩尺寸
            minRatio: 0.8, // 压缩率
        })
    ],
    optimization:{
        minimizer:[
            new CssMinimizerPlugin(), // 压缩css

            new TerserPlugin({ // 压缩js
                parallel: true, // 开启多线程压缩
                terserOptions: {
                    compress:{
                        pure_funcs: ["console.log"] // 删除console.log
                    }
                }
            })
        ],

        // 分隔代码
        splitChunks:{
            cacheGroups:{
                vendors:{ // 提取node_modules代码
                    test: /node_modules/, // 只匹配node_modules中的模块
                    name: 'vendors', // 提取文件命名为vendors, js后缀和chunkhash会自动加
                    minChunks: 1, // 只要使用一次就提取出来
                    chunks: 'initial', // 只提取初始化就能获取到的模块，不管异步的
                    minSize: 0, // 目标代码体积大于0就提取出来
                    priority: 1, // 提取优先级为1
                },
                commons: { // 提取页面公共代码
                    name: 'commons', // 提取文件命名为commons
                    minChunks: 2, // 只要使用两次就提取出来
                    chunks: 'initial', // 只提取初始化就能获取到的模块，不管异步的
                    minSize:0, // 目标代码体积大于0就提取出来
                }
            }
        }
    }
})
