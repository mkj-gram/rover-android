const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist/campaigns'),
        publicPath: '/campaigns/'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/
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
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
          }
        }),
        new UglifyJSPlugin()
    ],
    devServer: {
        historyApiFallback: {
            rewrites: [{ from: /\/campaigns\//, to: '/campaigns/index.html' }]
        },
        publicPath: '/campaigns/',
        contentBase: '/'
    },
    devtool: 'source-map'
}
