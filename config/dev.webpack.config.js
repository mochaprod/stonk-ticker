const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");

const USE_PROD = process.env.NODE_ENV === "production";
const ROOT = path.join("examples");

/**
 * Webpack config for development server/examples SPA.
 */
module.exports = {
    mode: USE_PROD ? "production" : "development",
    devtool: USE_PROD ? "source-map" : "cheap-module-source-map",
    entry: path.resolve(ROOT, "index.tsx"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "build.js",
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.indexHtml,
        }),
    ],
    devServer: {
        contentBase: "/examples/public",
        publicPath: paths.publicPath,
        port: 8888,
        compress: true,
        watchContentBase: true,
        hot: true,
        quiet: true,
        historyApiFallback: {
            disableDotRule: true,
        },
    },
};
