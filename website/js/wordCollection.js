function refreshCards() {
    $(".card-container .list").each(function() {
        if ($(this).find('.card').length == 0) {
            $(this).addClass("no-card")
        } else {
            $(this).removeClass("no-card")
        }
    });
}

function addNewsCard(media, header, detail) {
    var selector = ".card-container #" + media;
    var content = "<div class=\"card\">\
			<h5>" + header + "</h3>\
			<div class=\"detail\">" + detail + "</div>\
		</div>"
    $(selector).append(content);
    refreshCards()
}

function clearCards(media, header, detail) {
    $(".card-container .list").each(function(index) {
    	var header = $(this).find('h3').text()
        $(this).html('<h3>' + header + '<\/h3>')
    });
    refreshCards()
}


addNewsCard('liberty', 'the first news', 'detail')
