function p2AddNewsCard(media, header, detail) {
    var selector = "#page-2 .card-container ." + media;
    var content = "<div class=\"card\">\
			<h5>" + header + "</h3>\
			<div class=\"detail\">" + detail + "</div>\
		</div>"
    $(selector).append(content);
    refreshCards()
}

function p2ClearCards(media, header, detail) {
    $("#page-2 .card-container .list").each(function(index) {
    	var header = $(this).find('h3').text()
        $(this).html('<h3>' + header + '<\/h3>')
    });
    refreshCards()
}


p2AddNewsCard('udn', 'the special news', 'detail')
