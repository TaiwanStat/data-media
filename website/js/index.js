var report;
initLengend();
initWordCollection();
window.refreshCards();
$('.page-container').css('display', 'none');
$('#logo').addClass('loading');
$('#logo').addClass('small');
var IsReportGot = false;
$("#logo").one('animationiteration webkitAnimationIteration', function() {
  if (IsReportGot) {
    $("#logo").removeClass('loading');
    setTimeout(function() {
      $('#logo').removeClass('small');
    }, 10)
  }
});

$.get('report.json', function(t) {
  report = t;
  IsReportGot = true;
  var totoalNews = 0;
  var DELAY = 100;

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
  }, DELAY);

  var categoryData = {}
  media.forEach(function(d) {
    categoryData[d] = report[d]
  })
  window.createCategory(categoryData);

  var myWordCloud = wordCloud('div.cloud');
  window.showNewWords(myWordCloud);
  for (var item in mediaEN) {
    window.addVisWord(mediaEN[item], report[media[item]].words_median);
  }

  $('.page-container').css('display', '');
  $('.page-container').addClass('show-page')
  setTimeout(function() {
    $('.page-container').removeClass('show-page')
  }, 1000);

  initTitleAnalysis(t['title_analysis']);
});

$('.nav-about').on('click', function() {
  if ($('.page-container').hasClass('show-about')) {
    $('.page-container').addClass('hide-about')
      .removeClass('show-about');
    hideAbout();
  } else if ($('.page-container').hasClass('hide-about')) {
    $('.page-container').addClass('show-about')
      .removeClass('hide-about');
    showAbout();
  } else {
    $('.page-container').addClass('show-about')
    showAbout();
  }
})

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
    $('#word-collection').addClass('show')
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

function initWordCollection() {
  $('#modal-closer').on('click', function() {
    $('#modal-container').removeClass('show');
    $('#pop-content .card-container').removeClass('show');
    $('body,html').css('overflow', '');
  });
}

function initTitleAnalysis(news) {
  var analysis_keys = ['provocative', 'ptt_idiom'];
  for (m in media) {
    var m_key = media[m];
    for (k in analysis_keys) {
      var counter = 0;
      for (i in news[m_key][analysis_keys[k]]) {

        var listID = analysis_keys[k];
        var title = news[m_key][analysis_keys[k]][i].title;
        var url = news[m_key][analysis_keys[k]][i].url;
        var word = news[m_key][analysis_keys[k]][i].word;

        listID = listID.replace('_', '-');

        if (counter >= 4) {
          counter++;
          continue;
        }

        var m_keyEN = window.mediaNameTranslate(m_key)
        titleAnalysisAddNewsCard(m_keyEN, listID, title, word, url);
        counter++;
      }
    }
  }

  for (m in media) {
    var m_key = media[m];
    for (k in analysis_keys) {
      var listID = analysis_keys[k];
      listID = listID.replace('_', '-');
      count = news[m_key][analysis_keys[k]].length - 4
      if (count >= 1) {
        var m_keyEN = window.mediaNameTranslate(m_key)
        titleAnalysisAddNewsNum(m_keyEN, listID, count);
      }
    }
  }
}

function showAbout() {
  $('.nav-about .fa-arrow-right').addClass('show-about');
  $('body,html').css('overflow', 'hidden')

  var windowOffset = $(window).scrollTop();
  $('#about').css('top', windowOffset + 'px');
}

function hideAbout() {
  $('.nav-about .fa-arrow-right').removeClass('show-about');
  $('body,html').css('overflow', '')
}

function isPosBeyondIdTop(pos, id) {
  return pos >= $(id).offset().top;
}

function animateToId(id) {
  $('body,html').animate({ scrollTop: $(id).offset().top - 50 }, 'slow');
}
