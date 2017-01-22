$('.menu').on('click', function() {
  if ($('.container').hasClass('is-open')) {
    $('.menu').removeClass('is-active');
    $('.container').removeClass('is-open');
  } else {
    $('.menu').addClass('is-active');
    $('.container').addClass('is-open');
  }
});

$(window).on('scroll', function (event) {
  $('.legend-container').removeClass('hidden');
  $(window).off('scroll');
})

$('.nav li').on('click', function(event) {
  var duration = 0;

  $('.nav-primary')
    .removeClass('nav-primary')
    .addClass('nav-secondary');

  $(this)
    .removeClass('nav-secondary')
    .addClass('nav-primary');

  if (event.target.id === 'button1') {
    $("html, body").animate({scrollTop:0}, 'slow');
  } else if (event.target.id === 'button2') {
    var offset = $('#report').offset()
    $('body,html').animate({scrollTop: offset.top - 50});
  }
});

for(var i in media){
  var item = $('<a class="circle '+mediaEN[i]+'"></a><a>'+media[i]+'</a>');
  $('.legend-container').append(item);
}

window.refreshCards();

var report
$.get("report.json", function(t) {
  report = t;
  var totoalNews = 0;
  for(var i in media) {
    totoalNews += report[media[i]]['news_count'];
  }

  $('#num-news').text(totoalNews);
  var barData = [];
  for (var item in media) {
    barData.push({
      title: media[item],
      newsCount: report[media[item]].news_count
    });
  }

  setTimeout(function() {
    window.createNewsBarChart('#num-news-bar', barData);
  }, 100);

  var myWordCloud = wordCloud('div.cloud');
  window.showNewWords(myWordCloud);

  console.log(report)
  for (var item in mediaEN) {
    window.addVisWord(mediaEN[item], report[media[item]].words_median);
  }
});

