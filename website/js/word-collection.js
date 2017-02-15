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
  var selector = '#word-collection .'+ media + '-container';
    // TODO: rewrite by vue.js
  var content = '<a target="_blank" class="card" href="' +
    link + '"><h5>' + header + '</h5><div class="detail">' +
    detail + '</div></a>';
  $(selector).append(content);
  refreshCards();
}

function wordCollectionClearCards(media, header, detail) {
  $('#word-collection .list').each(function(index) {

    var header = $(this).find('h3').text()
    $(this).html('<h3>' + header + '</h3>')

  });
  refreshCards();
}
