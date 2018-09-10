const cluster = require("cluster");
const env = process.argv[2] || process.env.NODE_ENV || 'development';
const clusterConfig  = require("./config/cluster")[env];

const expressConfig = require("./config/express")[env];

function decodeSelector(str) {
    return str.replace("_hash", "#");
}
function checkSale(element, str) {
    let idx = str.indexOf("(");
    let idx1 = str.indexOf(")");
    if(idx < 0 || idx1 < idx) return false;
    let method = str.substring(0, idx);
    let exp = str.substring(idx+1, idx1);
    return element.hasClass(exp);
}
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
        console.time("sale process");
        let url = request.query.url;
        let selector = request.query.selector || ".productBuy_select_wrapper";
        let avatar = request.query.avatar || ".js-main_image";
        let saledetect = request.query.saledetect || "hasClass(add-soldout)";
        let name = request.query.name || "";
        if(name.length == 0) {
            let regex = /.*products\/([^\/]*)\/?$/g;
            name = url.replace(regex, "$1");
        }
        selector = decodeSelector(selector);
        avatar = decodeSelector(avatar);
        response.header('Content-Type', 'application/json');
        HTTP_UTIL.crawlHtml(url, true, function(err, body, res) {
            let obj = {
                "error": false,
                "message": ""
            };
            try {
                let $ = cheerio.load(body);
                let element = $(selector);
                let check = checkSale(element, saledetect);
                if(check) {
                    obj.available = false;
                } else {
                    obj.available = true;
                }
                let avatars = [];
                let avatarImg = $(avatar);
                if(avatarImg && avatarImg.length > 0) {
                    avatarImg.each(function() {
                        var src = $(this).attr('src');
                        if(src) {
                            avatars.push({"src" : src});
                        }
                    });
                }
                obj.name = name;
                obj.avatars = avatars;

            }
            catch(err) {
                obj.error = true;
                obj.message = err.message;
            }
            response.end(JSON.stringify(obj));
            console.timeEnd("sale process");
        });
    })
    .listen(expressConfig.port, expressConfig.host);
}