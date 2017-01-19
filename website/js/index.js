$('#page-1').addClass("load");​
$('.menu').on('click', function() {
    if ($('.container').hasClass('is-open')) {
        $('.menu').removeClass('is-active');
        $('.container').removeClass('is-open');
    } else {
        $('.menu').addClass('is-active');
        $('.container').addClass('is-open');
    }
});

$('body').scroll(function (event) {
    $('.legend-container').removeClass('hidden')
    $('body').off()
})



$('.nav li').on('click', function(event) {
    var duration = 0;
    $('.nav-primary').removeClass('nav-primary').addClass('nav-secondary')
    $(this).removeClass('nav-secondary').addClass('nav-primary')

    if (event.target.id === 'button1') {
        $('#page-2').removeClass('load')
        $('#page-1').addClass('load');​

    } else if (event.target.id === 'button2') {
        $('#page-1').removeClass('load')
        $('#page-2').addClass('load');​
    }
});
for(i in media){
    item = $('<a class="circle '+mediaEN[i]+'"></a><a>'+media[i]+'</a>')
    $('.legend-container').append(item)
    
}
refreshCards()

var report

$.get("report.json", function(t) {
    report = t
    totoalNews = 0
    for(i in media) {
        totoalNews += report[media[i]]['news_count']
    }
    $('#num-news').text(totoalNews)
    barData = []
    for (var item in media) {
        barData.push({
            title: media[item],
            newsCount: report[media[item]]['news_count']
        });
    }


    /********************/

    setTimeout(function() {
        createNewsBarChart('#num-news-bar', barData)
    }, 100)

    var myWordCloud = wordCloud('div.cloud');
    showNewWords(myWordCloud);

    console.log(report)
    for (var item in mediaEN) {
        addVisWord(mediaEN[item], report[media[item]]['words_median'])
}

})

