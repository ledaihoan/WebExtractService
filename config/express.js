module.exports = {
    development: {
        host: "0.0.0.0",
        port: 3000,
        staticFiles: {
            path: "/",
            dir: "public",
            options: {
                index: "index.html"
            }
        }
    },
    production: {
        host: "0.0.0.0",
        port: 8080,
        staticFiles: {
            path: "/",
            dir: "public",
            options: {
                index: "index.html"
            }
        }
    }
};