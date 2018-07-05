const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const ip = require('ip')

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.tsx', '.js', '.ts']
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
                loaders: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                HOST: JSON.stringify(ip.address()),

                FIREBASE_CONFIG_APIKEY:
                    process.env.NODE_ENV === 'staging' ||
                    process.env.NODE_ENV === 'development' ||
                    process.env.NODE_ENV === undefined
                        ? JSON.stringify(
                              'AIzaSyCmqfZ71UUPtFqNf-7pteYV9mf_WgMdLOk'
                          )
                        : JSON.stringify(
                              'AIzaSyCNy8ZZbgNOuyiXqnVtk8JfljQ5hOuM_MY'
                          ),

                FIREBASE_CONFIG_AUTHDOMAIN:
                    process.env.NODE_ENV === 'staging' ||
                    process.env.NODE_ENV === 'development' ||
                    process.env.NODE_ENV === undefined
                        ? JSON.stringify('rover-admin-staging.firebaseapp.com')
                        : JSON.stringify(
                              'rover-admin-production.firebaseapp.com'
                          ),

                FIREBASE_CONFIG_DATABASEURL:
                    process.env.NODE_ENV === 'staging' ||
                    process.env.NODE_ENV === 'development' ||
                    process.env.NODE_ENV === undefined
                        ? JSON.stringify(
                              'https://rover-admin-staging.firebaseio.com'
                          )
                        : JSON.stringify(
                              'https://rover-admin-production.firebaseio.com'
                          ),

                FIREBASE_CONFIG_PROJECTID:
                    process.env.NODE_ENV === 'staging' ||
                    process.env.NODE_ENV === 'development' ||
                    process.env.NODE_ENV === undefined
                        ? JSON.stringify('rover-admin-staging')
                        : JSON.stringify('rover-admin-production'),

                FIREBASE_CONFIG_STORAGEBUCKET:
                    process.env.NODE_ENV === 'staging' ||
                    process.env.NODE_ENV === 'development' ||
                    process.env.NODE_ENV === undefined
                        ? JSON.stringify('rover-admin-staging.appspot.com')
                        : JSON.stringify('rover-admin-production.appspot.com'),

                FIREBASE_CONFIG_MESSAGINGSENDERID:
                    process.env.NODE_ENV === 'staging' ||
                    process.env.NODE_ENV === 'development' ||
                    process.env.NODE_ENV === undefined
                        ? JSON.stringify('368601128815')
                        : JSON.stringify('1026237313662')
            }
        }),
        new UglifyJSPlugin()
    ],
    devServer: {
        historyApiFallback: {
            rewrites: [{ from: /\/admin\//, to: '/index.html' }]
        },
        publicPath: '/',
        contentBase: '/',
        useLocalIp: true
    },
    devtool: 'source-map'
}
