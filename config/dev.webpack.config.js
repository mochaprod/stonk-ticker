const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require("./paths");

const USE_PROD = process.env.NODE_ENV === "production";
const ROOT = path.join("examples");

const CSS_REGEX = /\.s?css$/;
const CSS_MODULES_REGEX = /\.mod\.s?css$/;

const styleLoaders = (modules = false) => {
    return [
        USE_PROD ? MiniCssExtractPlugin.loader : "style-loader",
        {
            loader: "css-loader",
            options: {
                modules,
                sourceMap: !USE_PROD,
            },
        },
        {
            loader: "sass-loader",
            options: {
                sourceMap: !USE_PROD,
            },
        },
    ];
};

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
        publicPath: "/stonk-ticker/",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
            {
                test: CSS_MODULES_REGEX,
                use: styleLoaders(true),
            },
            {
                test: CSS_REGEX,
                exclude: CSS_MODULES_REGEX,
                use: styleLoaders(),
            },
        ],
    },
    resolve: {
        extensions: [
            ".tsx", ".ts", ".js", ".jsx", ".json",
            ".scss", ".css",
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.indexHtml,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash:8].css",
        }),
    ],
    devServer: {
        contentBase: "./examples/public",
        publicPath: paths.publicPath,
        port: 8888,
        host: "0.0.0.0",
        compress: true,
        watchContentBase: true,
        hot: true,
        quiet: true,
        historyApiFallback: {
            disableDotRule: true,
        },
    },
};
