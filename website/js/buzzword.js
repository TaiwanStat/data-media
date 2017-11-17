function initBuzzword(data) {
  data.forEach(function(b, i){
      var html = `  <div class="buzzword-container active" data-index="${i}">
      <div class="buzzword-title-container">
        <h3 class="buzzword"><span>${(i + 1)}.</span>${b['word']}</h3>
        <h5>
          成長<i class="fa fa-arrow-up" aria-hidden="true"></i>
          <span class="buzzword-growth">${(b['growth'] / b['news_num'] * 100).toFixed(1) + '%'}</span>
          </h3>
      </div>
      <div class="two-column-list">
        <div>
          <h5>
          情緒性報導
          <i class="fa fa-question-circle help-i" data-type="provocative" aria-hidden="true"></i>
          </h5>
          <ul class="provocative-list">
          </ul>
        </div>
        <div>
          <h5>
          報導數量
          <i class="fa fa-question-circle help-i" data-type="num" aria-hidden="true"></i>
          </h5>
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
  $('.buzzwords .help-i').hover(function(e){
    const pos = $(e.target).offset()
    let content
    pos.top -= $(window).scrollTop()
    $('#help .content').toggleClass('hide-hover')
    $('#help').animate(pos)

    if ($(e.target).data('type') === "provocative"){
      content = `<h4>情緒性報導</h4>
透過分析新聞資料的內文與標題，並以詞語向量化 ( word2vec ) 、群聚 ( cluster ) 的技術，找出與「!」相近的用詞集，並作為以下定義的「情緒性用詞」。
而情緒性報導是為，新聞標題中含有情緒性用詞的報導，此處統計各家媒體報導本週熱詞時情緒性報導的比率。`
    } else{
      content = `<h4>報導數量</h4>統計 6 家媒體對熱詞的報導數量，並分別排序其每天的報導比率（熱詞報導數量/總報導數量），若有一家媒體報導比率的中位數低於整體的25%，或大於整體的75%，即為少量報導、大量報導。`
    }

    $('#help .hover-tip').html(content)
    $('#help .hover-tip').toggle('slow')
    $('#help .fa').addClass('hide-icon')
  }, function(e){
    $('#help').css({
      left: '',
      top: '',
      color: ''
    })
    $('#help .content').toggleClass('hide-hover')
    $('#help .hover-tip').toggle('slow')
    $('#help .fa').removeClass('hide-icon')
  })
}

function appendBuzzwordProvocativeList(index, provo_data){
  var seletor = `.buzzword-container[data-index="${index}"] .provocative-list`
  $(seletor).empty()
  var STANDARD = 0.05
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
      var html = `<li class="hightlight"><span class="media-name">${media[m]}</span><span class="news-num">少量報導</span></li>`
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