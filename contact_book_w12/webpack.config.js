module.exports = {
    // Entry point of our application
    entry: './app/app.js',
    // Where we want out bundle to output to
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        // Webpack loaders, we are using loader for:
        // Babel: (transpiling ES2015 -> browser friend JS)
        // React: To read in ReactJS JSX syntax (HTML elements in JS)
        // Stage-0: No utilizing yet, we will be when we start using Redux
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0']
            }
        }]
    }
};