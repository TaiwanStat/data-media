function refreshCards() {
    $(".card-container .list").each(function() {
        if ($(this).find('.card').length == 0) {
            $(this).addClass("no-card")
        } else {
            $(this).removeClass("no-card")
        }
    });
}

function p1AddNewsCard(media, header, detail) {
    var selector = "#page-1 .card-container ." + media;
    var content = "<div class=\"card\">\
			<h5>" + header + "</h3>\
			<div class=\"detail\">" + detail + "</div>\
		</div>"
    $(selector).append(content);
    refreshCards()
}

function p1ClearCards(media, header, detail) {
    $("#page-1 .card-container .list").each(function(index) {
    	var header = $(this).find('h3').text()
        $(this).html('<h3>' + header + '<\/h3>')
    });
    refreshCards()
}


p1AddNewsCard('liberty', 'the first news', 'detail')
