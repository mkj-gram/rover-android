const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, "dist/audience"),
        publicPath: "/audience/"
    },
    module: {
        rules: [
            {
                test: /\.exec\.js$/,
                loader: "script-loader"
            },
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: [/node_modules/, /\.exec\.js$/]
            },
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html"
        })
    ],
    devServer: {
        historyApiFallback: {
            rewrites: [{ from: /\/audience\//, to: "/audience/index.html" }]
        },
        publicPath: "/audience/",
        contentBase: "/"
    },
    devtool: "source-map"
}
