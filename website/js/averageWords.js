function addVisWord(media, avgWords) {
    var selector = ".avgWords-container ." + media;
    var header = '<h3>' + mediaEN2C[media] + '<\/h3><span>'+avgWords+'<\/span><span class="avgWords-scale">字<\/span>'
    var content = "<div class=\"visbar\"></div>".repeat(avgWords/10)
    $(selector).html(header+content);
}

function clearVisWord(media, header, detail) {
    $(".avgWords-container .visWords-container").each(function(index) {
    	var header = $(this).find('h3').text()
        $(this).html('<h3>' + header + '<\/h3>')
    });
}


// addVisWord('liberty', 'the first news', 'detail')


//produce fake data
var wordsData = {}
for (var item in mediaEN) {
    wordsData[ mediaEN[item] ] = Math.round(Math.random() * 200 + 100)
}

//map data to visualization
for (var item in mediaEN) {
    addVisWord(mediaEN[item], wordsData[ mediaEN[item] ])
}
