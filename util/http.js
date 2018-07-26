const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
const PROXIES = [
    "10.30.58.23:1145", "10.30.58.23:1146", "10.30.58.23:1147", "10.30.58.23:1148"
];
const env = process.argv[2] || process.env.NODE_ENV || 'development';
const request = require("request");
function random(limit) {
    let rand = Math.random();
    return Math.floor(limit * rand);
}
function randomProxy() {
    return "http://" + PROXIES[random(4)];
}
function generateHttpOptions(url, method, gzip, json) {
    let accept = json ? "application/json" : "text/html";
    let headers = {
        'Accept': accept,
        'Accept-Charset': 'utf-8',
        'Content-Type': 'text/html;UTF-8;charset=utf-8',
        'User-Agent': USER_AGENT
    };
    let options = {
        uri: url,
        method: method,
        gzip: true,
        headers: headers,
        followRedirect: true,
        maxRedirects: 10,
    };

    if(gzip) {
        options.gzip = true;
    }
    if(env == 'production') {
        // options.proxy = randomProxy();
    }
    return options;
}
function crawlHtml(url, gzip, callback) {
    let options = generateHttpOptions(url, "GET", gzip);
    request(url, options, function(err, response, body) {
        if(err) return callback(err);
        if(!body) return callback(new Error("download return empty doc!"));
        return callback(null, body, response);
    });
}
function generateReadabilityOptions() {
    let options = {
        headers: {
            'User-Agent': userAgent
        }
    };
    if(env == 'production') {
        options.proxy = randomProxy();
    }
    return options;
}
module.exports = {
    randomProxy: randomProxy,
    crawlHtml: crawlHtml,
    generateReadabilityOptions: generateReadabilityOptions
};