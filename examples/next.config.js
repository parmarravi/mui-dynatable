// next.config.js

// Use absolute import for better maintainability
const path = require('path');

// Import SVG and font loaders for modularity
// const svgLoader = require('loaders/svg');
// const fontLoader = require('loaders/fonts');

// const path = require('path');

module.exports = {
    output: 'export',

    images: {
        unoptimized: true
    },

    webpack: (config, { isServer }) => {
        // Add SVG loader
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
        });

        config.module.rules.push({
            test: /\.js$/,
            include: /node_modules\/mui-dynatable/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        });

        // Add font loader
        // config.module.rules.push(fontLoader);

        // Add CSS loader
        // config.module.rules.forEach((rule) => {
        //     if (rule.test.test('.css')) {
        //         rule.use.push({
        //             loader: 'postcss-loader'
        //         });
        //     }
        // });

        // Exclude fonts from export
        if (!isServer) {
            config.externals.push(/static\/fonts\/.*$/);
        }

        return config;
    }

    // webpack: (config, { isServer }) => {
    //     // Add rule for SVG files
    //     config.module.rules.push({
    //         test: /\.svg$/,
    //         use: ['@svgr/webpack']
    //     });

    //     config.module.rules.push({
    //         test: /\.js$/,
    //         include: /node_modules\/mui-dynatable/,
    //         use: {
    //             loader: 'babel-loader',
    //             options: {
    //                 presets: ['@babel/preset-env', '@babel/preset-react']
    //             }
    //         }
    //     });

    //     config.module.rules.forEach((rule) => {
    //         if (rule.test.test('.css')) {
    //             rule.use.push({
    //                 loader: 'postcss-loader'
    //             });
    //         }
    //     });

    //     if (!isServer) {
    //         // Exclude the fonts from being processed by webpack during static export
    //         config.externals.push(/static\/fonts\/.*$/);
    //     }

    //     return config;
    // }

    // webpack: (config, { isServer }) => {
    //     // Add rule for SVG files
    //     config.module.rules.push({
    //         test: /\.svg$/,
    //         use: ['@svgr/webpack']
    //     });

    //     // Add rule for font files
    //     config.module.rules.push({
    //         test: /\.(woff|woff2|eot|ttf|otf)$/i,
    //         use: [
    //             {
    //                 loader: 'file-loader',
    //                 options: {
    //                     outputPath: 'static/fonts',
    //                     publicPath: isServer ? '../' : ''
    //                     //publicPath: isServer ? `${path.relative(config.output.path, config.context)}/static/fonts/` : '/static/fonts/'
    //                 }
    //             }
    //         ]
    //     });

    //     return config;
    // }
};
