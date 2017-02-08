function addVisWord(media, avgWords) {
  var mediaChineseName = mediaNameTranslate(media);
  if (mediaChineseName === '中央通訊社')
    mediaChineseName = '中央社'
  var selector = '.avgWords-container .' + media + '-container';
  var header = '<h3>' + mediaChineseName + '<\/h3><span>' + avgWords +
    '<\/span><span class="avgWords-scale">字<\/span>';
  var content = '<div class="visbar"></div>'.repeat(avgWords / 10);
  $(selector).html(header + content);
}

function clearVisWord() {
  $('.avgWords-container .visWords-container').each(function(index) {
    var header = $(this).find('h3').text();
    $(this).html('<h3>' + header + '<\/h3>')
  });
}