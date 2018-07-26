let model = require("../extractModel");
model.extract("http://dantri.com.vn/xa-hoi/vu-4-nguoi-bi-lu-cuon-nhung-tang-da-hang-chuc-tan-vui-lap-3-can-nha-20180720154619789.htm", function(err, res) {
    if(err) console.log(err.message);
    let title = res.article.title;
    let passed = title.length > 10;
    console.log("test passed = " + passed + ", title = " + title + ", links = " + res.links.length);
});