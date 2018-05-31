const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const ip = require('ip')

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist/campaigns'),
        publicPath: '/campaigns/'
    },
    resolve: {
        extensions: ['.tsx', '.js', '.ts'],
        alias: {
            react: path.resolve('node_modules/react')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.ts|\.tsx$/,
                loader: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.css$/,
                loaders: ['css-loader']
            },
            {
                test: /\.png$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        // new CopyWebpackPlugin([
        //     { from: 'public', to: '' }
        // ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
                HOST: JSON.stringify(ip.address())
            }
        }),
        new UglifyJSPlugin()
    ],
    devServer: {
        historyApiFallback: {
            rewrites: [{ from: /\/campaigns\//, to: '/campaigns/index.html' }]
        },
        publicPath: '/campaigns/',
        contentBase: '/',
        useLocalIp: true
    },
    devtool: 'source-map'
}
