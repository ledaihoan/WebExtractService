const env = process.argv[2] || process.env.NODE_ENV || 'development';

const HTTP_UTIL = require("./util/http");

const GROUP_TEMPLATE = "https://graph.facebook.com/groupId/feed?access_token=AToken&limit=MLimit";

function readGroupFeed(groupId, accessToken, limit, callback) {
    let api = GROUP_TEMPLATE.replace("groupId", `${groupId}`).replace("AToken", `${accessToken}`).replace("MLimit", `${limit}`);
    HTTP_UTIL.crawlHtml(api, false, (err, body, res) => {
        let obj = JSON.parse(body);
        return callback(err, obj);
    });
}

module.exports = {
    readGroupFeed: readGroupFeed
};