vms.averageWords = {}
averageWordsData = {}
averageWordsData.items = []
mediaEN.forEach(function(d,i){
  var classObj = {};
  classObj[d+'-container'] = true;
  averageWordsData.items.push({
    class: classObj,
    name: media[i],
    avgWords: 'null',
    vis: ''
  })
})
vms.averageWords = new Vue({
  delimiters: ['${', '}'],
  el: '.avgWords-container',
  data: averageWordsData
})

function addVisWord(media, avgWords) {
  var mediaChineseName = mediaNameTranslate(media);
  if (mediaChineseName === '中央通訊社')
    mediaChineseName = '中央社';
  var mediaIndex = mediaEN.indexOf(media);
  averageWordsData.items[mediaIndex].avgWords = avgWords.toString();

  var vis = '<div class="visbar"></div>'.repeat(avgWords / 10);
  averageWordsData.items[mediaIndex].vis = vis
}

function clearVisWord() {
  $('.avgWords-container .visWords-container').each(function(index) {
    var header = $(this).find('h3').text();
    $(this).html('<h3>' + header + '</h3>');
  });
}
