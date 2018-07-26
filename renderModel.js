const PREFIX = "<!DOCTYPE html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>Web Extract Service</title>\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" />\n" +
    "    <link rel=\"stylesheet\" type=\"text/css\" href=\"https://baomoi-static.zadn.vn/zalo-news/css/bootstrap.min.css\">\n" +
    "    <link rel=\"stylesheet\" type=\"text/css\" href=\"https://baomoi-static.zadn.vn/zalo-news/css/bootstrap-theme.min.css\">\n" +
    "    <link rel=\"stylesheet\" type=\"text/css\" href=\"/css/style.css\">\n" +
    "</head>\n" +
    "<body>\n" +
    "<div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-7 col-md-offset-0\">\n" +
    "            <div class=\"article-area\">";

    "                <h1 id=\"title\" class=\"article-title\"></h1>\n" +
    "                <p id=\"byline\"></p>\n" +
    "                <p id=\"excerpt\"></p>\n" +
    "                <div id=\"body\" class=\"body\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div id=\"relate-links\" class=\"col-md-5 col-md-offset-0\">\n" +
    "\n" +
    "        </div>\n";
const SUFFIX =
    "    </div>\n" +
    "</div>\n" +
    "<script src=\"https://baomoi-static.zadn.vn/zalo-news/js/jquery-3.3.1.min.js\"></script>\n" +
    "<script src=\"https://baomoi-static.zadn.vn/zalo-news/js/bootstrap.min.js\"></script>\n" +
    "</body>\n" +
    "</html>";

function generateHtml(res, url) {
    let article = res.article;
    let links = res.links;
    let articleHtml = "                <h1 id=\"title\" class=\"article-title\"><a href='" + url + "' target='_blank'>" + article.title + "</a></h1>\n" +
        "                <p id=\"byline\">" + (article.byline ? "Publisher: <strong>" + article.byline + "</strong>" : "") + "</p>\n" +
        "                <p id=\"excerpt\" " + (article.excerpt ? "class=\"description\"" : "") + ">" + (article.excerpt ? article.excerpt : "") + "</p>\n" +
        "                <div id=\"body\" class=\"body\">" + article.content + "</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div id=\"relate-links\" class=\"col-md-5 col-md-offset-0\">\n";
    for(let i = 0; i < links.length;i++) {
        let linkHtml = "<p><a href='/extract?url=" + links[i] + "' target='_blank'>" + links[i] + "</a></p>";
        articleHtml += linkHtml;
    }
    articleHtml += "        </div>\n";
    return PREFIX + articleHtml + SUFFIX;
}
function generateEHtml(err) {
    let html = "                <h1 id=\"title\" class=\"article-title\"></h1>\n" +
        "                <p id=\"byline\"></p>\n" +
        "                <p id=\"excerpt\"></p>\n" +
        "                <div id=\"body\" class=\"body\">" + err.message + "</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div id=\"relate-links\" class=\"col-md-5 col-md-offset-0\">\n" +
        "\n" +
        "        </div>";
    return PREFIX + html + SUFFIX;
}

module.exports = {
    generateHtml : generateHtml,
    generateEHtml: generateEHtml
};