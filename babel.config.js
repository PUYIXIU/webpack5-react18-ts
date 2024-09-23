const isDEV = process.env.NODE_ENV === 'development';
module.exports = {
    // 处理顺序：
    // 1. 处理ts
    // 2. 处理jsx
    // 3. babel转换
    "presets":[
        [
            "@babel/preset-env",
            {
                //设置浏览器版本，优先使用.browserslistrc，
                // "targets":{
                //     "ie": 9,
                //     "chrome": 35,
                // },
                "useBuiltIns": "usage", // 按需添加
                "corejs": 3 // 版本
            }
        ],
        "@babel/preset-react",
        "@babel/preset-typescript"
    ],
    'plugins':[
        isDEV && require.resolve('react-refresh/babel'),
    ].filter(Boolean), // 过滤空值
}
