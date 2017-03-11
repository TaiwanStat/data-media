function titleAnalysisAddNewsCard(media, listID, header, word, link) {
  var selector = '#title-analysis #' + listID + ' .' + media + '-container .cards';
  // TODO: rewrite by vue.js
  header = header.replace(word, '<em>' + word + '</em>');
  var content = '<a target="_blank" class="card" href="' +
    link + '"><h5>' + header + '</h5></a>';

  $(selector).append(content);
  window.refreshCards();
}


function titleAnalysisClearCards(media, header, detail) {
  $('#title-analysis .list').each(function(index) {
    var header = $(this).find('h3').text();
    $(this).html('<h3>' + header + '</h3>');
  });
  window.refreshCards();
}

function ShowTitleAnalysisInModal(event) {
  var m_key = $(event.target).data('media');
  var listID = $(event.target).data('list');
  var news = report['title_analysis'];

  m_key = window.mediaNameTranslate(m_key)

  $('#modal-container').addClass('show');
  setTimeout(function() {
    $('#pop-content .card-container').addClass('show');
    $('#pop-content .card-container .list').empty();
    console.log(m_key)
    console.log(listID)
    for (i in news[m_key][listID]) {
      var title = news[m_key][listID][i].title;
      var link = news[m_key][listID][i].url;
      var word = news[m_key][listID][i].word;
      title = title.replace(word, '<em>' + word + '</em>');

      var selector = '#pop-content .card-container .list';

      var content = '<a target="_blank" class="card" href="' +
        link + '"><h5>' + title + '</h5></a>';
      $(selector).append(content);
      console.log(selector)
    }

    refreshCards();
    $('body,html').css('overflow', 'hidden')
  }, 500)
}


function titleAnalysisAddNewsNum(media, listID, num) {
  var selector = '#title-analysis #' + listID + ' .' + media + '-container .cards';
  // TODO: rewrite by vue.js
  listID = listID.replace('-','_');
  var content = '<h5 class="remaining-news-num" data-media="' + media + '" data-list="' + listID + '">與其他 ' +
    num + ' 則新聞...</h5>';
  $(selector).append(content).on('click', window.ShowTitleAnalysisInModal);
  refreshCards();
}
