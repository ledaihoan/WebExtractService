$("#test").click(() => {
    $("#excerpt").removeClass("description");
    let url = $("#url").val();
    $.get("/parse?url=" + url, function(res, status) {
        console.log(res);
        if(status == "success") {
            let article = res.data.article;
            $("#title").html("<a href='" + url + "' target='_blank'>" + article.title + "</a>");
            $("#extract-ref").html("<a href='/extract?url=" + url + "' target='_blank'>view extract</a>");
            if(article.byline) {
                $("#byline").html("Publisher: <strong>" + article.byline + "</strong>");
            }
            if(article.excerpt) {
                $("#excerpt").text(article.excerpt);
                $("#excerpt").addClass("description");
            }
            $("#body").html(article.content);
            let links = res.data.links;
            for(let i = 0; i < links.length; i++) {
                $("#relate-links").append("<p><a href='" + links[i] +  "'>" + links[i] + "</a></p>");
            }
        }
    });
});