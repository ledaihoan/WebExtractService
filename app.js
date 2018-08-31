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
    const HTTP_UTIL = require("./util/http");
    const renderModel = require("./renderModel");
    const cheerio = require("cheerio");
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
    })
    .get("/jpsale", (request, response) => {
        let url = request.query.url;
        let selector = request.query.selector || ".productBuy_select_wrapper";
        response.header('Content-Type', 'application/json');
        HTTP_UTIL.crawlHtml(url, true, function(err, body, res) {
            let obj = {
                "error": false,
                "message": ""
            };
            try {
                let $ = cheerio.load(body);
                var element = $(selector);
                if($(selector).hasClass("add-soldout")) {
                    obj.available = false;
                } else {
                    obj.available = true;
                }
            }
            catch(err) {
                obj.error = true;
                obj.message = err.message;
            }
            response.end(JSON.stringify(obj));
        });
    })
    .listen(expressConfig.port, expressConfig.host);
}