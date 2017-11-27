$.fn.extend({
  animateCss: function (animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function () {
      $(this).removeClass('animated ' + animationName);
      if (callback) {
        callback();
      }
    });
    return this;
  }
});

// const icon = '<i class="fa fa-info-circle" aria-hidden="true"></i>'
// const info = `<h5>${icon} 本週因蘋果日報網站更新，部分資料有所缺漏</h5>`
const info = ''
let qureyWordTop

var media = ['蘋果日報', '聯合報', '自由時報', '東森新聞雲', '中央通訊社', '中國時報'];
var mediaEN = ['apple', 'udn', 'liberty', 'ettoday', 'cna', 'china'];
var smallDesktopWidthSize = 980;
var mediaColor = {
  '中央通訊社': '#26A69A',
  '蘋果日報': '#ef5350',
  '東森新聞雲': '#5C6BC0',
  '自由時報': '#FFCA28',
  '聯合報': '#FF7043',
  '中國時報': '#03A9F4'
};
var report;
var provocative_list = []
var IsReportGot = false;
let IsDetailGot = false

var now = moment.now();
var tz = moment.tz(now, 'Asia/Taipei').subtract(1, 'days')
var weekNum = tz.format('W')

var s3Url = 'https://s3-ap-northeast-1.amazonaws.com/tw-media-data/report/'
var reportUrl = s3Url + 'week_' + weekNum + '.json'
var detailUrl = s3Url + 'detail_' + weekNum + '.json'
let section = -1

$('.page-container').hide()
window.refreshCards();
$('.loader').append(info)
$('#help').hide()
$('.advance-section-container').hide()

function mediaNameTranslate(mediaName) {
  var dict = {
    'apple': '蘋果日報',
    'udn': '聯合報',
    'liberty': '自由時報',
    'ettoday': '東森新聞雲',
    'cna': '中央通訊社',
    'china': '中國時報',
    '蘋果日報': 'apple',
    '聯合報': 'udn',
    '自由時報': 'liberty',
    '東森新聞雲': 'ettoday',
    '中央通訊社': 'cna',
    '中國時報': 'china'
  };

  return dict[mediaName];
}

const scrollTip =
`<div id="tip">
  使用
  <em>shift</em>+
  <span class="mouse-icon">
    <span class="scroll-btn"></span>
  </span>水平捲動
</div>`

$(document).ready(function () {

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  initWordCollection();
  $('#logo').addClass('loading');
  $('#logo').addClass('small');

  if(!isMac){
    $('#before-tip').after(scrollTip)
  }

  $.getJSON(reportUrl, function (t) {
    report = t;
    IsReportGot = true;
    var totoalNews = 0;
    var DELAY = 100;

    $('.loader').fadeOut('slow')
    $('#info').fadeOut('slow')
    $('.page-container').show()

    $("#logo").one('animationiteration webkitAnimationIteration', function () {
      console.log('report loaded')
      $("#logo").removeClass('loading');
      setTimeout(function () {
        $('#logo').removeClass('small');
      }, 10)
    });
    $('.buzzwords .outer').on('scroll', function(){
      if ($('.buzzwords .outer').scrollLeft() > 360 ){
        $('#tip').hide()
        $('.buzzwords .outer').off('scroll')
      }
    })

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
    setTimeout(function () {
      window.createNewsBarChart('#num-news-bar', barData);
    }, DELAY);



    $('.page-container').css('display', '');
    $('.page-container').addClass('show-page')
    setTimeout(function () {
      $('.page-container').removeClass('show-page')
    }, 1000);

    initBuzzword(t['buzzword'])
    initWordAnalysis(t['word_analysis'])
    initDate(t['time'])
    initAbout()

    $('#help').show('slow')
    $('#help .fa-angle-up').hide()
    $('#help .content, #help .hover-tip').hide()
    $('#help').on('click', function () {
      $('#help .content').toggle('slow')
      $('#help .fa-angle-up').toggle('slow')
      $('#help .fa-question').toggle('slow')
    })
  });
  if ($(window).width() > 980){
    $('.band.footer').before(`<section class="band">
        <div class="band-container polis-container">
          <div class="band-inner">
            <div>
              <h1>分享與討論</h1>
              <h2 class="sub-title">
                有什麼想法嗎？在這裡為你的立場發聲
              </h2>
            </div>
            <div class='polis' data-page_id='page-1' data-site_id='polis_site_id_QKXjXCd0z0A2hkx8l2'>
            </div>
          </div>
        </div>
      </section>
    `)
    $('body').append("<script async='true' src='https://pol.is/embed.js'></script>")
  }
  $.getJSON(detailUrl,function(t){
    console.log('detail loaded')
    $('.advance-section-container').show()
    $('.cloud-loader').hide()
    report.words_count = t
    var myWordCloud = wordCloud('div.cloud');
    showNewWords(myWordCloud);

    var buzzword = d3.selectAll('.cloud text')
    var renderedWord = buzzword[0].map((d) => {
      return d.innerHTML
    })
    var wordData = t.map((d) => d[0])
    var HotestRenderedWordIndex = -1

    for (var i = 0; i < wordData.length; i++) {
      HotestRenderedWordIndex = renderedWord.findIndex((d) => {
        return d == wordData[i]
      })
      if (HotestRenderedWordIndex != -1) {
        break
      }
    }
    $(buzzword[0][HotestRenderedWordIndex]).d3Click()
    qureyWordTop = $('.qurey-word-container-mob .qurey-word').offset().top
  })
})

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
const SHOWDIST = $(window).height() * 0.75;
const updateAnimation = 'rotateIn'

$(window).on('scroll', function(event) {
  const pos = $(window).scrollTop() + SHOWDIST;
  if (isPosBeyondIdTop(pos, '.cloud') && section != 3){
    var title = '<h4>用詞文字雲</h4>'
    var content = title + `統計 6 家媒體本週新聞標題內的用詞，在標題內<em>出現次數越多者字體越大</em>。`
    content = content + '<h4>詞彙新聞集</h4>'
    content = content + '點擊用詞雲中的詞語，可以在詞彙新聞集中查看 6 家媒體報導此詞語的時間軸，與各自的新聞，其中<em>上色者為情緒性報導</em>。'
    section = 3
    $('#help .content').html(content)
    $('#help').animateCss(updateAnimation)
  } else if (isPosBeyondIdTop(pos, '.horizontal-lists') && !isPosBeyondIdTop(pos, '.cloud')  && section != 2) {
    var title = ''
    var content = title + `<h4>情緒性報導排行</h4>統計 6 家媒體本週情緒性報導比率的前五名，例如：「台灣  50%」，代表這家媒體所有標題含有「台灣」的報導，標題有 50% 含有情緒性用詞。</p>
<h4>少量報導主題</h4>分析同一詞語在 6 家媒體中，如果這家媒體對於這個詞語的關注度較低，即為少量報導主題。</p>`
    section = 2
    $('#help .content').html(content)
    $('#help').animateCss(updateAnimation)
  } else if (isPosBeyondIdTop(pos, '.buzzwords') && !isPosBeyondIdTop(pos, '.horizontal-lists') && section != 1) {
    var title = '<h4>本週熱詞</h4>'
    var list_html = provocative_list.map(function(w){
      return w.trim().length === 0 ? '' : '<li>' + w + '</li>'
    }).join(' ')
    var content = title + `統計本週搜集的所有新聞標題內的用詞，與上週資料做比較，<em>使用次數成長最多者</em>，即為本週的熱詞。
<h4>情緒性報導</h4>
透過分析新聞資料的內文與標題，並以詞語向量化 ( word2vec ) 、群聚 ( cluster ) 的技術，找出與「!」相近的用詞集，並作為以下定義的「情緒性用詞」。
而情緒性報導是為，新聞標題中含有情緒性用詞的報導，此處統計各家媒體報導本週熱詞時情緒性報導的比率。「情緒性用詞」包含<ol>${list_html}
</ol><h4>報導數量</h4>統計 6 家媒體對熱詞的報導數量，並分別排序其每天的報導比率（熱詞報導數量/總報導數量），若有一家媒體報導比率的中位數低於整體的25%，或大於整體的75%，即為少量報導、大量報導。`
    section = 1
    $('#help .content').html(content)
    $('#help').animateCss(updateAnimation)
  } else if (!isPosBeyondIdTop(pos, '.buzzwords') && section != 0){
    var title = ''
    var content = title + `統計6家媒體於官方網站上，一周內所發表之新聞量。
    <h4>資料來源</h4>
    <ol>
    <li>蘋果日報(含即時新聞)</li>
    <li>自由時報(含即時新聞)</li>
    <li>東森新聞雲(含即時新聞)</li>
    <li>聯合報</li>
    <li>中央通訊社</li>
    <li>中國時報</li>
    </ol>
    `
    section = 0
    
    $('#help .content').html(content)
    $('#help').animateCss(updateAnimation)
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
})

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
  var begin = dateData.begin.replace(/-/g, '/').slice(5)
  var end = dateData.end.replace(/-/g, '/').slice(5)
  var html = begin + ' ~ ' + end
  $('.nav-time').html(html)
}