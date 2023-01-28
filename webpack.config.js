const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "url": require.resolve("url/"),
            "util": require.resolve("util/"),
            "os": require.resolve("os-browserify/browser"),
            "https": require.resolve("https-browserify"),
            "path": require.resolve("path-browserify"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),  
            "http": require.resolve("stream-http"), 
            "assert": require.resolve("assert/"),
            "tls": require.resolve("tls-browserify"),
            "fs": require.resolve("fs-extra"),
            "constants": require.resolve("constants-browserify"),
            "net": require.resolve("net")
        }
    }
    
};
