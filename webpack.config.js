const config = {
    mode: "production",
    entry: {
        main: "./src/assets/js/main.js",
    },
    output: {
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: []
};

module.exports = config;