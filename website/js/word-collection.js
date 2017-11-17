function ShowWordCollectionInModal(event) {
  var firedMediaName = mediaNameTranslate($(event.target).data('media'));
  var qureyWord = $('.qurey-word')[0].innerText.split('目前選定：')[1]
  var IndexOfWord;
  if (qureyWord === '')
    return;
  $('#modal-container').addClass('show');
  setTimeout(function() {
    $('#pop-content .card-container').addClass('show');
    $('#pop-content .card-container .list').empty();
    $('#pop-content .about-container').empty();

    for (var i = 0; i < report.words_count.length; i++) {
      if (report.words_count[i][0] === qureyWord) {
        IndexOfWord = +i;
        break;
      }
    }
    var news = report.words_count[IndexOfWord][2];

    for (var i = 0; i < news.length; i++) {
      var news_media = news[i].media
      if(news_media !== firedMediaName)
        continue
      var selector = '#pop-content .card-container .list';
      var header = news[i].title;
      var detail = '';
      var link = news[i].url;
      var style = news[i].isProvocative ? 'background-color:#ffc7b3' : ''
      var content = '<a target="_blank" class="card" style ="' + style + '" href="' +
        link + '"><h5>' + header + '</h5><div class="detail">' +
        detail + '</div></a>';
      $(selector).append(content);
    }
    refreshCards();
    $('body,html').css('overflow','hidden')
  }, 500)
}

function refreshCards() {
  $('.card-container .list').each(function() {
    if ($(this).find('.card').length == 0) {
      $(this).addClass('no-card');
    } else {
      $(this).removeClass('no-card');
    }
  });
}

function wordCollectionAddNewsCard(media, header, detail, link, isProvocative) {
  var selector = '#word-collection .' + media + '-container .cards';
  var style = isProvocative ? 'background-color:#ffc7b3' : ''
  var content = '<a target="_blank" class="card" style="' + style + '" href="' +
    link + '"><h5>' + header + '</h5><div class="detail">' +
    detail + '</div></a>';
  $(selector).append(content);
  refreshCards();
}

function wordCollectionAddNewsNum(media, num) {
  var selector = '#word-collection .' + media + '-container .cards';
  // TODO: rewrite by vue.js
  var content = '<h5 class="remaining-news-num" data-media="' + media + '">與其他 ' +
    num + ' 則新聞...</h5>';
  $(selector).append(content);
  $(selector).find('.remaining-news-num').on('click', ShowWordCollectionInModal);
  refreshCards();
}

function wordCollectionAddProvocativeNum(media, num) {
  $('#word-collection .' + media + '-container .provative-num').remove()
  var style = num > 5 ? 'color:coral' : 'opacity:0.6' 
  var selector = '#word-collection .' + media + '-container h3';
  var content = '<h5 class="provative-num" style=' + style + '> ' + num + ' % 標題含情緒字眼</h5>';
  $(selector).after(content);
  refreshCards();
}

function wordCollectionClearCards(media, header, detail) {
  $('#word-collection .list .cards').each(function(index) {
    $(this).html('')
  });

  refreshCards();
}
