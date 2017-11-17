function initWordAnalysis(data) {
  for(var m in media){
    var html = $('<div>').addClass('card')
    html.append('<h3>'+ media[m] + '</h3>')
    html.append(getWordAnalysisProvocativeList(data['provocative'][media[m]]))
    html.append(getWordAnalysisOutlinerList(data['outliner'][media[m]]))
    $('.horizontal-lists .outer').append(html)
  }
  $('.horizontal-lists .help-i').hover(function (e) {
    const pos = $(e.target).offset()
    let content
    pos.top -= $(window).scrollTop()
    $('#help .content').toggleClass('hide-hover')
    $('#help').animate(pos)

    if ($(e.target).data('type') === "provocative") {
      content = `<h4>情緒性報導</h4>
透過分析新聞資料的內文與標題，並以詞語向量化 ( word2vec ) 、群聚 ( cluster ) 的技術，找出與「!」相近的用詞集，並作為以下定義的「情緒性用詞」。
而情緒性報導是為，新聞標題中含有情緒性用詞的報導，此處統計各家媒體報導本週熱詞時情緒性報導的比率。`
    } else {
      content = `<h4>報導數量</h4>統計 6 家媒體對熱詞的報導數量，並分別排序其每天的報導比率（熱詞報導數量/總報導數量），若有一家媒體報導比率的中位數低於整體的25%，或大於整體的75%，即為少量報導、大量報導。`
    }

    $('#help .hover-tip').html(content)

    $('#help .hover-tip').toggle('slow')
    $('#help .fa').addClass('hide-icon')
  }, function (e) {
    $('#help').css({
      left: '',
      top: '',
      color: ''
    })
    $('#help .content').toggleClass('hide-hover')
    $('#help .hover-tip').toggle('slow')
    $('#help .fa').removeClass('hide-icon')
  })
  $('.horizontal-lists .outer').append('<div style="visibility: hidden"><h5>placeholder</h5><div>')
}

function getWordAnalysisProvocativeList(data){
  var html = $('<div>').addClass('provocative list').append('<h5>情緒報導排行<i class="fa fa-question-circle help-i" data-type="provocative" aria-hidden="true"></h5>')
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
  return $.merge(getOverOutlinerList(data), getUnderOutlinerList(data))
}

function getOverOutlinerList(data){
  var html = $('<div>').addClass('outliner list').append('<h5>大量報導主題<i class="fa fa-question-circle help-i" data-type="num" aria-hidden="true"></h5>')
  var hasData = false
  var ol = $('<ol>')
  var count = 0
  data = Object.keys(data).filter(d=>data[d].trend==1)
  for (var i in data) {
    hasData = true
    ol.append('<li><span>' + data[i] + '</span><span>大量報導</span></li>')
    count++
    if (count >= 10)
      break
  }
  if (!hasData) {
    html.append('<h5 class="not-found">沒有找到大量報導主題</h5>')
  } else {
    html.append(ol)
  }
  return html
}

function getUnderOutlinerList(data) {
  var html = $('<div>').addClass('outliner list').append('<h5>少量報導主題<i class="fa fa-question-circle help-i" data-type="num" aria-hidden="true"></h5>')
  var hasData = false
  var ol = $('<ol>')
  var count = 0
  data = Object.keys(data).filter(d => data[d].trend == -1)
  for (var i in data) {
    hasData = true
    ol.append('<li><span>' + data[i] + '</span><span>少量報導</span></li>')
    count++
    if (count >= 10)
      break
  }
  if (!hasData) {
    html.append('<h5 class="not-found">沒有找到少量報導主題</h5>')
  } else {
    html.append(ol)
  }
  return html
}