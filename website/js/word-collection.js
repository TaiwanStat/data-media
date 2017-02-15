var wordCollectionData = {}
wordCollectionData.lists = []
mediaEN.forEach(function(d) {
  var className = {};
  className[d + '-container'] = true;
  var mediaName = mediaNameTranslate(d)

  wordCollectionData.lists.push({
    class: className,
    name: mediaName,
    cards: []
  })

})

vms.wordCollection = new Vue({
  delimiters: ['${', '}'],
  el: '#first-collection',
  data: wordCollectionData
})

function refreshCards() {
  $('.card-container .list').each(function() {
    if ($(this).find('.card').length == 0) {
      $(this).addClass('no-card');
    } else {
      $(this).removeClass('no-card');
    }
  });
}

function showCards() {
  $('.card-container .list').each(function() {
    $(this).removeClass('no-card');
  });
}

function wordCollectionAddNewsCard(media, header, detail, link) {
  var mediaIndex = mediaEN.indexOf(media);
  content = {
    header: header,
    detail: detail,
    link: link
  }
  wordCollectionData.lists[mediaIndex].cards.push(content)
  showCards();
}

function wordCollectionClearCards(media, header, detail) {
  wordCollectionData.lists.forEach(function(d) {
    d.cards = []
  })
  refreshCards();
}
