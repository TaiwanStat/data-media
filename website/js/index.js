$('.page-container').hide()

var report;
var provocative_list = []
initLengend();
initWordCollection();
window.refreshCards();
$('#logo').addClass('loading');
$('#logo').addClass('small');
$('#help').hide()


var IsReportGot = false;

var now = moment.now();
var tz = moment.tz(now, 'Asia/Taipei').subtract(1, 'days')
var weekNum = tz.format('W')


var s3Url = 'https://s3-ap-northeast-1.amazonaws.com/tw-media-data/report/'
var objectUrl = s3Url + 'week_' + weekNum + '.json'

$.getJSON(objectUrl, function (t) {
  report = t;
  IsReportGot = true;
  var totoalNews = 0;
  var DELAY = 100;

  $('.loader').fadeOut('slow')
  $('.page-container').show()

  $("#logo").one('animationiteration webkitAnimationIteration', function () {
    console.log('report loaded')
    $("#logo").removeClass('loading');
    setTimeout(function () {
      $('#logo').removeClass('small');
    }, 10)
  });

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

  // var categoryData = {}
  // media.forEach(function(d) {
  //   categoryData[d] = report[d]
  // })
  // window.createCategory(categoryData);

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

  initBuzzword(t['buzzword'])
  initWordAnalysis(t['word_analysis'])
  initDate(t['time'])
  initAbout()
  var buzzword = d3.selectAll('text').filter(function (d, i) { return d.text === t['words_count'][0][0] })
  $(buzzword[0]).d3Click()

  $('#help').show('slow')
  $('#help .fa-angle-up').hide()
  $('#help .content').hide()
  $('#help').on('click', function(){
    $('#help .content').toggle('slow')
    $('#help .fa-angle-up').toggle('slow')
    $('#help .fa-question').toggle('slow')
  })

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

$.get('dist/provocative_words.txt', function (data) {
  provocative_list = data.split('\n')
})

$('body').on('scroll', function(event) {
  var SHOWDIST = $(window).height() * 0.75;
  var pos = $(window).scrollTop() + SHOWDIST;
  if (isPosBeyondIdTop(pos, '.cloud')) {
    $('.legend-container').removeClass('hidden');
  } else {
    $('.legend-container').addClass('hidden');
  }

  if (isPosBeyondIdTop(pos, '#word-collection')) {
    var title = '<h4>詞彙新聞集</h4>'
    var content = title + '點擊用詞雲中的詞語，可以在詞彙新聞集中查看 6 家媒體報導此詞語的時間軸，與各自的新聞，其中<em>上色者為情緒性報導</em>。'
    $('#help .content').html(content)
  } else if (isPosBeyondIdTop(pos, '.cloud')){
    var title = '<h4>媒體用詞雲</h4>'
    var content = title + `統計 6 家媒體本週新聞標題內的用詞，在標題內<em>出現次數越多者字體越大</em>。`
    $('#help .content').html(content)
  } else if (isPosBeyondIdTop(pos, '.horizontal-lists')) {
    var title = '<h4>標題用詞報告</h4>'
    var content = title + `<hr><strong>情緒性報導排行</strong>統計 6 家媒體本週情緒性報導比率的前五名，例如：「台灣  50%」，代表這家媒體所有標題含有「台灣」的報導，標題有 50% 含有情緒性用詞。</p>
<hr><strong>少量報導主題</strong>分析同一詞語在 6 家媒體中，如果這家媒體對於這個詞語的關注度較低，即為少量報導主題。</p>`
    $('#help .content').html(content)
  } else if (isPosBeyondIdTop(pos, '.buzzwords')) {
    var title = '<h4>本週熱詞</h4>'
    var list_html = provocative_list.map(function(w){
      return '<li>' + w + '</li>'
    }).join(' ')
    var content = title + `統計本週搜集的所有新聞標題內的用詞，與上週資料做比較，<em>使用次數成長最多者</em>，即為本週的熱詞。
<hr>
<strong>情緒性報導</strong>
透過分析新聞資料的內文與標題，並以詞語向量化 ( word2vec ) 、群聚 ( cluster ) 的技術，找出與「酸」相近的用詞集，並作為以下定義的「情緒性用詞」。
而情緒性報導是為，新聞標題中含有情緒性用詞的報導，此處統計各家媒體報導本週熱詞時情緒性報導的比率。「情緒性用詞」包含<ol>` + list_html + 
`</ol><hr><strong>報導數量</strong>統計 6 家媒體對本周熱詞的報導數量，分析其數量。`
    $('#help .content').html(content)
  } else {
    var title = ''
    var content = title + `統計6家媒體於官方網站上，一周內所發表之新聞量。
    <hr><strong>資料來源</strong>
    <ol>
    <li>蘋果日報</li>
    <li>聯合報</li>
    <li>自由時報</li>
    <li>東森新聞雲</li>
    <li>中央通訊社</li>
    <li>中國時報</li>
    </ol>
    `
    $('#help .content').html(content)
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
  setTimeout(function(){
    $('.nav-about .fa-arrow-right').addClass('show-about');
    var windowOffset = $(window).scrollTop();
    $('#about').css('top', windowOffset + 'px');
    $('body,html').css('overflow', 'hidden');
  },750);
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

function initDate(dateData){
  var begin = dateData.begin.replace('-', '/').slice(5)
  var end = dateData.end.replace('-', '/').slice(5)
  var html = begin + ' ~ ' + end
  $('.nav-time').html(html)
}