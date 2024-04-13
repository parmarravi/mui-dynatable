import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import image from '@rollup/plugin-image'; // Import the image plugin

export default {
    input: 'src/index.js', // Update this path to your library's entry point
    output: {
        file: 'dist/bundle.js', // Update this path to your desired output file
        format: 'umd', // Universal Module Definition (UMD)
        name: 'mui-dynatable', // Name of your library (optional)
        globals: {
            react: 'React', // External dependencies (optional)
            'react-dom': 'ReactDOM'
        }
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled' // Use 'bundled' for Rollup
        }),
        resolve(),
        commonjs({
            include: /node_modules/,
            extensions: ['.js', '.jsx'] // Include JSX files
        }),
        postcss({
            extract: true, // Extract CSS to a separate file
            modules: true // Enable CSS modules (optional)
        }),
        image(), // Add the image plugin
        terser() // Minify the bundle (optional)
    ],
    external: ['react', 'react-dom'] // Specify external dependencies (optional)
};
