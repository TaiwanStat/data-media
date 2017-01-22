function refreshCards() {
    $(".card-container .list").each(function() {
        if ($(this).find('.card').length == 0) {
            $(this).addClass("no-card")
        } else {
            $(this).removeClass("no-card")
        }
    });
}

function p1AddNewsCard(media, header, detail,link) {
    var selector = "#page-1 .card-container ." + media+"-container"
    var content = "<a target=\"_blank\" class=\"card\" href=\""+link+"\">\
      <h5>" + header + "<\/h5>\
      <div class=\"detail\">" + detail + "<\/div>\
    <\/a>"
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


// p1AddNewsCard('liberty', 'the first news', 'detail')
