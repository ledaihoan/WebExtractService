const HTTP_UTIL = require("./util/http");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const readability = require("readability/index");
const Readability = readability.Readability;
const linkRegx = ["?", "#"];
function extractDomain(url) {
    let idx = url.indexOf("://");
    if(idx < 0) return url;
    let protocol = url.substring(0, idx+3), domain = protocol + url.substring(idx+3).split("/")[0];
    return domain;
}
function normalizeArticleLink(link) {
    for(let i = 0; i < linkRegx.length; i++) {
        let idx = link.indexOf(linkRegx[i]);
        if(idx > -1) return link.substring(0, idx);
    }
    return link;
}
function validateLink(link, domain) {
    let nLink = normalizeArticleLink(link);
    let path = nLink;

    if(nLink.indexOf("/") != 0) {
        let domain = extractDomain(nLink);
        path = nLink.replace(domain, "");
    } else {
        nLink = domain + nLink;
    }
    return path.length > 50 ? nLink : false;
}
function extractLinks(document, url) {
    let result = [];
    let domain = extractDomain(url);
    let anchors = document.querySelectorAll("a[href]");
    for(let i = 0; i < anchors.length; i++) {
        let link = validateLink(anchors[i].href, domain);
        if(link && result.indexOf(link) == -1) result.push(link);
    }
    return result;
}
function extract(url, callback) {
    HTTP_UTIL.crawlHtml(url, true, (err, body, response) => {
        if(err) return callback(err);
        let { window } = new JSDOM(body);
        let document = window.document;
        let links = extractLinks(document, url);
        let article = new Readability(document).parse();
        let res = {
            article: article,
            links: links
        };
        window.close();
        return callback(null, res)
    });
}
module.exports = {
    extract: extract
};