const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development'
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    // 1. 入口文件
    entry: path.join(__dirname,'../src/index.tsx'),

    // 2. 打包文件出口
    output: {
        filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js的名称
        path: path.join(__dirname, '../dist'), // 打包结果
        clean: true,
        publicPath: '/', // 打包后文件的公共前缀路径
    },

    // 3. loader解析ts和jsx
    module:{
        rules:[
            {   // 配置babel
                include: [path.resolve(__dirname, '../src')],
                test: /.(ts|tsx)$/,
                use:["thread-loader" ,"babel-loader"]
            },
            {  // 配置css文件
                include: [path.resolve(__dirname, '../src')],
                test: /\.css$/,
                use:[
                    // 开发环境使用style-loader， 打包模式抽取css
                    isDev?'style-loader':MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {  // 配置less文件
                include: [path.resolve(__dirname, '../src')],
                test: /\.less$/,
                use:[
                    isDev?'style-loader':MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {   // 配置图片文件
                test: /.(png|jpg|jpeg|gif|svg)$/,
                type: "asset",
                parser:{
                    dataUrlCondition:{ // 小于10kb，转base64位
                        maxSize: 10 * 1024,
                    }
                },
                generator:{
                    filename:'static/images/[name].[contenthash:8][ext]' // 文件输出目录和命名
                }
            },
            {
                test:'/.(woff2?|eot|ttf|otf)$/',
                type:'asset',
                parser:{
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    }
                },
                generator:{
                    filename:'static/fonts/[name].[contenthash:8][ext]',
                }
            },
            {
                test:'/.(mp4|webm|ogg|mp3|wav|flac|aac)$/',
                type:'asset',
                parser:{
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    }
                },
                generator:{
                    filename:'static/media/[name].[contenthash:8][ext]',
                }
            },
        ]
    },

    // 4. 文件引用后缀配置
    resolve: {
        extensions: [".js", ".tsx", ",ts"],
        alias:{
            '@':path.join(__dirname, '../src')
        },
        modules: [path.resolve(__dirname, '../node_modules')],
    },

    // 5. 添加html插件
    plugins: [
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname, '../public/index.html'),  // 设置模版
            inject:true, // 是否自动注入
        }),
        new webpack.DefinePlugin({
            'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
        })

    ],

    // 6. 配置缓存策略
    cache:{
        type:'filesystem', // 使用文件缓存
    }
}

