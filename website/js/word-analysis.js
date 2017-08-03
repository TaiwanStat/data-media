function initWordAnalysis(data) {
  for(var m in media){
    var html = $('<div>')
    html.append('<h3>'+ media[m] + '</h3>')
    html.append(getWordAnalysisProvocativeList(data['provocative'][media[m]]))
    html.append(getWordAnalysisOutlinerList(data['outliner'][media[m]]))
    $('.horizontal-lists').append(html)
  }
}

function getWordAnalysisProvocativeList(data){
  var html = $('<div>').addClass('provocative list').append('<h5>情緒報導排行</h5>')
  var hasData = false
  var ol = $('<ol>')
  for (var i = 0; i < 5; i++) {
    hasData = true
    ol.append('<li><span>' + data[i].word + '</span><span>' + (data[i].rate*100).toFixed(1) + '%</span></li>')
  }
  if(!hasData){
    html.append('<h5>無資料</h5>')
  } else {
    html.append(ol)
  }
  return html
}

function getWordAnalysisOutlinerList(data){
  var html = $('<div>').addClass('outliner list').append('<h5>少量報導主題</h5>')
  var hasData = false
  var ol = $('<ol>')
  for (var i in data) {
    hasData = true
    ol.append('<li><span>' + i + '</span><span>少量報導</span></li>')
  }
  if (!hasData) {
    html.append('<h5>無資料</h5>')
  } else {
    html.append(ol)
  }
  return html
}