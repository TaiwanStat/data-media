function ShowWordCollectionInModal(event) {
  var firedMediaName = $(event.target).text();
  var qureyWord = $('#qurey-word').text()
  var IndexOfWord;
  if (qureyWord === '')
    return;

  $('#modal-container').addClass('show');
  setTimeout(function() {
    $('#pop-content .card-container').addClass('show');
    $('#pop-content .card-container .list').empty();

    for (var i = 0; i < report.words_count.length; i++) {
      if (report.words_count[i][0] === qureyWord) {
        IndexOfWord = +i;
        break;
      }
    }
    news = report.words_count[IndexOfWord][2];

    for (var i = 0; i < news.length; i++) {
      var selector = '#pop-content .card-container .list';
      var header = news[i].title;
      var detail = '';
      var link = news[i].url;
      var content = '<a target="_blank" class="card" href="' +
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

function wordCollectionAddNewsCard(media, header, detail, link) {
  var selector = '#word-collection .' + media + '-container .cards';
  // TODO: rewrite by vue.js
  var content = '<a target="_blank" class="card" href="' +
    link + '"><h5>' + header + '</h5><div class="detail">' +
    detail + '</div></a>';
  $(selector).append(content);
  refreshCards();
}

function wordCollectionAddNewsNum(media, num) {
  var selector = '#word-collection .' + media + '-container .cards';
  // TODO: rewrite by vue.js
  var content = '<h5 class="remaining-news-num">與其他 ' +
    num + ' 則新聞...</h5>';
  $(selector).append(content);
  $(selector).find('.remaining-news-num').on('click', window.ShowWordCollectionInModal);
  refreshCards();
}

function wordCollectionClearCards(media, header, detail) {
  $('#word-collection .list .cards').each(function(index) {
    $(this).html('')
  });

  refreshCards();
}
