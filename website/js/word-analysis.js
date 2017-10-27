function initWordAnalysis(data) {
  for(var m in media){
    var html = $('<div>').addClass('card')
    html.append('<h3>'+ media[m] + '</h3>')
    html.append(getWordAnalysisProvocativeList(data['provocative'][media[m]]))
    html.append(getWordAnalysisOutlinerList(data['outliner'][media[m]]))
    $('.horizontal-lists').append(html)
  }
  $('.horizontal-lists').append('<div style="visibility: hidden"><h5>placeholder</h5><div>')
}

function getWordAnalysisProvocativeList(data){
  var html = $('<div>').addClass('provocative list').append('<h5>情緒報導排行</h5>')
  var hasData = false
  var ol = $('<ol>')
  var dataLen = data.length > 5 ? 5 : data.length
  for (var i = 0; i < dataLen; i++) {
    if(data[i].rate !== 0){
      hasData = true
      ol.append('<li><span>' + data[i].word + '</span><span>' + (data[i].rate * 100).toFixed(1) + '%</span></li>')
    }
  }
  if(!hasData){
    html.append('<h5 class="not-found">沒有找到情緒報導</h5>')
  } else {
    html.append(ol)
  }
  return html
}

function getWordAnalysisOutlinerList(data){
  var html = $('<div>').addClass('outliner list').append('<h5>少量報導主題</h5>')
  var hasData = false
  var ol = $('<ol>')
  var count = 0
  for (var i in data) {
    hasData = true
    ol.append('<li><span>' + i + '</span><span>少量報導</span></li>')
    count++
    if(count >= 10)
      break
  }
  if (!hasData) {
    html.append('<h5 class="not-found">沒有找到少量報導主題</h5>')
  } else {
    html.append(ol)
  }
  return html
}