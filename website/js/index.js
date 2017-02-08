var report;
initLengend();
window.refreshCards();

$.get('report.json', function(t) {
  report = t;
  var totoalNews = 0;
  for (var i in media) {
    totoalNews += report[media[i]].news_count;
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
  for (var item in mediaEN) {
    window.addVisWord(mediaEN[item], report[media[item]].words_median);
  }
});


$('.menu').on('click', function() {
  if ($('.container').hasClass('is-open')) {
    $('.menu').removeClass('is-active');
    $('.container').removeClass('is-open');
  } else {
    $('.menu').addClass('is-active');
    $('.container').addClass('is-open');
  }
});

$(window).on('scroll', function(event) {
  var pos = $('body').scrollTop() + 50

  if (isPosBeyondIdTop(pos, '#cloud')) {
    $('.legend-container').removeClass('hidden');
  } else {
    $('.legend-container').addClass('hidden');
  }

  if (isPosBeyondIdTop(pos, '#discussion')) {
    $('.nav a').removeClass('nav-primary')
    $('#button3').addClass('nav-primary');
  } else if (isPosBeyondIdTop(pos, '#report')) {
    $('.nav a').removeClass('nav-primary')
    $('#button2').addClass('nav-primary');
  } else {
    $('.nav a').removeClass('nav-primary')
    $('#button1').addClass('nav-primary');
  }

  if (isPosBeyondIdTop(pos, '#timeline')) {
    $('.card-container').addClass('show')
  }
})

$('.nav li').on('click', function(event) {
  var targetId = event.target.id;

  if (targetId === 'button1') {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  } else if (targetId === 'button2') {
    var offset = $('#report').offset();
    animateToId('#report')
  } else if (targetId === 'button3') {
    animateToId('#discussion')
  }
});

function initLengend() {
  for (var i in media) {
    var item = $('<a class="circle ' + mediaEN[i] + '"></a><a>' + media[i] + '</a>');
    $('.legend-container').append(item);
  }
}

function isPosBeyondIdTop(pos, id) {
  return pos > $(id).offset().top;
}

function animateToId(id) {
  $('body,html').animate({ scrollTop: $(id).offset().top - 50 }, 'slow');
}
