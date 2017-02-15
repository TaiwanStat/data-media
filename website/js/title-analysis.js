function titleAnalysisAddNewsCard(media, header, detail) {
  var selector = '#title-analysis .' + media;
  // TODO: rewrite by vue.js
  var content = '<div class="card"><h5>' +
    header + '</h3><div class="detail">' +
    detail + '</div></div>';

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
