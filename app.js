const cluster = require("cluster");
const env = process.argv[2] || process.env.NODE_ENV || 'development';
const clusterConfig  = require("./config/cluster")[env];

const expressConfig = require("./config/express")[env];

if(cluster.isMaster) {
    (function initChildProcesses(){
        let max_processes = clusterConfig.MAX_PROCESSES;
        for(let i = 0; i < max_processes; i++) {
            cluster.fork();
        }
        cluster.on("exit", (worker, code, signal) => {
            cluster.fork();
        });
    })();
} else {
    const express = require("express");
    let app = express();
    let options = expressConfig.staticFiles.options;
    let path = expressConfig.staticFiles.path;
    let dir = expressConfig.staticFiles.dir;
    const extractModel = require("./extractModel");
    const renderModel = require("./renderModel");
    app.use(path, express.static(dir, options));
    app.get("/parse", (request, response) => {
        let url = request.query.url;
        response.header('Content-Type', 'application/json');
        extractModel.extract(url, function(err, res) {
            let resObj = {
                "error": false,
                "message": ""
            };
            if(err) {
                resObj.error = true;
                resObj.message = err.message;
            } else {
                resObj.data = res;
            }
            response.end(JSON.stringify(resObj));
        });
    })
    .get("/extract", (request, response) => {
        let url = request.query.url;
        response.header('Content-Type', 'text/html');
        extractModel.extract(url, function(err, res) {
            let content;
            if(err) {
                console.log(err.message);
                content = renderModel.generateEHtml(err);
            } else {
                content = renderModel.generateHtml(res, url);
            }
            response.end(content);
        });
    }).listen(expressConfig.port, expressConfig.host);
}