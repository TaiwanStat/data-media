function initBuzzword(data) {
  data.forEach(function(b, i){
      var html = `  <div class="buzzword-container active" data-index="${i}">
      <div class="buzzword-title-container">
        <h3 class="buzzword">${(i+1)+'.'+b['word']}</h3>
        <h5>
          成長<i class="fa fa-arrow-up" aria-hidden="true"></i>
          <span class="buzzword-growth">${(b['growth'] / b['news_num'] * 100).toFixed(1) + '%'}</span>
          </h3>
      </div>
      <div class="two-column-list">
        <div>
          <h5>情緒性報導</h5>
          <ul class="provocative-list">
          </ul>
        </div>
        <div>
          <h5>報導數量</h5>
          <ul class="outliner-list">
          </ul>
        </div>
      </div>
    </div>`
    $('.buzzwords .outer').append(html)
    appendBuzzwordProvocativeList(i, b['provocativeRate'])
    appendBuzzwordOutlinerList(i, b['isOutline'])
  })
  $('.buzzwords .outer').append('<div class="buzzword-container"><h5>placeholder</h5></div>')
}

function appendBuzzwordProvocativeList(index, provo_data){
  var seletor = `.buzzword-container[data-index="${index}"] .provocative-list`
  $(seletor).empty()
  var STANDARD = 10
  for (var m in media) {
    if (provo_data[media[m]] > STANDARD) {
      var html = `<li class="hightlight"><span class="media-name">${media[m]}</span><span class="provocative-num">${(provo_data[media[m]]*100).toFixed(1)}%</span></li>`
      $(seletor).append(html)
    }
  }
  for (var m in media) {
    if (provo_data[media[m]] <= STANDARD) {
      var html = `<li><span class="media-name">${media[m]}</span><span class="provocative-num">${(provo_data[media[m]]*100).toFixed(1)}%</span></li>`
      $(seletor).append(html)
    }
  }
}

function appendBuzzwordOutlinerList(index, outliner_data) {
  var seletor = `.buzzword-container[data-index="${index}"] .outliner-list`
  $(seletor).empty()
  for (var m in media) {
    if (outliner_data[media[m]] === 1) {
      var html = `<li class="hightlight"><span class="media-name">${media[m]}</span><span class="news-num">大量報導</span></li>`
      $(seletor).append(html)
    }
  }
  for (var m in media) {
    if (outliner_data[media[m]] === -1) {
      var html = `<li><span class="media-name">${media[m]}</span><span class="news-num">正常報導</span></li>`
      $(seletor).append(html)
    }
  }
  for (var m in media) {
    if (outliner_data[media[m]] === 0) {
      var html = `<li><span class="media-name">${media[m]}</span><span class="news-num">正常報導</span></li>`
      $(seletor).append(html)
    }
  }
}