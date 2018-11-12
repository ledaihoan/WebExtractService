$("#submit").click(() => {
   let token = $("#access_token").val();
   let groupId = $("#group-select option:selected").attr("value");
   let limit = $("#limit-select option:selected").attr("value");
   let data = {
       access_token: token,
       groupId: groupId,
       limit: limit
   };
   $.post("/fbfeed", data, function(result) {
       if(result && result.data) {
           for(let i = 0; i < result.data.length; i++) {
               let html = formatFeed(result.data[i]);
               $("#feeds").append(html);
           }
       }
   });
});
let toggle = false;
let codeHint = $("#codeHint");
$("#toggle").click(() => {
    toggle = !toggle;
    if(toggle) codeHint.show();
    else codeHint.hide();
});
let formatFeed = function(feed) {
    let groupId = $("#group-select option:selected").attr("value");
    let groupName = $("#group-select option:selected").text();
    let msg = "<p>" + feed.message.replace(/\n/g, "</p>") + "</p>";
    let html = `<div class="row">
            <div class="col-md-9">
                <p><a href='https://facebook.com/${feed.from.id}' target="_blank" >${feed.from.name}</a> >> <a href='https://facebook.com/${groupId}' target="_blank" >${groupName}</a></p>
            </div>
            <div class="col-md-3">
                <button class="btn btn-default"><a href='https://facebook.com/${feed.id}' target="_blank" >Link gốc</a></button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <p><em>${feed.created_time}</em></p>
                <div>${msg}</div>
            </div>
        </div><hr/>`;
    return html;
};