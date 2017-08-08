function initBuzzword(data) {
  $('#buzzword').html(data['word'])
  $('#buzzword-growth').html(data['growth'])
  appendBuzzwordProvocativeList(data['provocativeRate'])
  appendBuzzwordOutlinerList(data['isOutline'])
}

function appendBuzzwordProvocativeList(provo_data){
  $('#provocative-list').empty()
  var STANDARD = 10
  for (var m in media) {
    if (provo_data[media[m]] > STANDARD) {
      var html = '<li class="hightlight"><span class="media-name">' + media[m] + '</span><span class="provocative-num">' + (provo_data[media[m]]*100).toFixed(1) + '%</span></li>'
      $('#provocative-list').append(html)
    }
  }
  for (var m in media) {
    if (provo_data[media[m]] <= STANDARD) {
      var html = '<li><span class="media-name">' + media[m] + '</span><span class="provocative-num">' + (provo_data[media[m]]*100).toFixed(1) + '%</span></li>'
      $('#provocative-list').append(html)
    }
  }
  
}

function appendBuzzwordOutlinerList(outliner_data) {
  $('#outliner-list').empty()
  for (var m in media) {
    if (outliner_data[media[m]] === 1) {
      var html = '<li class="hightlight"><span class="media-name">' + media[m] + '</span><span class="news-num">大量報導</span></li>'
      $('#outliner-list').append(html)
    }
  }
  for (var m in media) {
    if (outliner_data[media[m]] === -1) {
      var html = '<li><span class="media-name">' + media[m] + '</span><span class="news-num">正常報導</span></li>'
      $('#outliner-list').append(html)
    }
  }
  for (var m in media) {
    if (outliner_data[media[m]] === 0) {
      var html = '<li><span class="media-name">' + media[m] + '</span><span class="news-num">正常報導</span></li>'
      $('#outliner-list').append(html)
    }
  }
}