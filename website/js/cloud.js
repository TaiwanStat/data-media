//Based on
//1. https://github.com/jasondavies/d3-cloud
//2. https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html

function getRootElementFontSize() {
  // Returns a number
  return parseFloat(
    // of the computed font-size, so in px
    getComputedStyle(
      // for the root <html> element
      document.documentElement
    )
    .fontSize
  );
}

function convertRem(value) {
  return value * getRootElementFontSize();
}

function wordCloud(selector) {

  var fill = d3.scale.category20();
  var nav_width = 240;
  var width;
  var marginCloud = 80;

  if ($(window).width() > smallDesktopWidthSize) {
    width = $(window).width() - (nav_width + 2 * marginCloud);
  } else {
    width = $(window).width() - 2 * marginCloud;
  }

  width = width > 960 ? 960 : width;
  //Construct the word cloud's SVG element
  var svg = d3.select(selector).append('svg')
    .attr('width', width)
    .attr('height', 500)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',250)');


  //Draw the word cloud
  function draw(words) {
    var cloud = svg.selectAll('g text')
      .data(words, function (d) {
        return d.text;
      })

    var isExistOutliers = function (timelineData) {

      var result = false
      var STANDARD = 5
      var numOfReached = 0

      timelineData.forEach(function(d){
        if (d.count < STANDARD){
          result = true
          numOfReached++
        }
      })

      return (numOfReached < 7) && result ? true : false
    }

    var getColor = function (d) {
      var isHightlight = isExistOutliers(report.words_count[d.index][3]);
      var key;
      var word_data = report.words_count[d.index][2]
      var news_amount = word_data.length
      //find the media has greatest words_appear_ratio
      dict = {};
      for (i in mediaEN) {
        dict[mediaEN[i]] = {};
        dict[mediaEN[i]].count = 0;
        dict[mediaEN[i]].provocativeNum = 0;
      }
      for (var news in word_data) {
        var media = mediaNameTranslate(word_data[news].media);
        dict[media].count++
        if (word_data[news].isProvocative == true)
          dict[media].provocativeNum++
      }
      var isProvocative = false;
      for (var media in dict) {
        var provocativeRatio = dict[media].provocativeNum / dict[media].count
        if (provocativeRatio > 0.1 && dict[media].count > 20)
          isProvocative = true
      }
      var color;
      if ( isProvocative && isHightlight){
        color = 'purple'
      } else if (isProvocative){
        color = 'red'
      } else if (isHightlight){
        color = 'blue'
      } else {
        color = 'lightgrey'
      }
      return color
    }
    //Entering words
    cloud.enter()
      .append('text')
      .style('font-family', 'Impact')
      .style('fill', function (d, i) {
        return (getColor(d))
      })
      .style('font-weight', function (d) {
        return (d.size > 21 ? 600 : 100)
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', 1)
      .attr('cursor', 'pointer')
      .text(function (d) {
        return d.text;
      }).on('click', function (d) {
        // add word collection
        var offset = $('#timeline').offset();
        var NUM_OF_SHOWED_NEWS = 6
        var nonProvocativeNewses = []
        $('body,html').animate({
          scrollTop: offset.top - 25
        }, 'slow');
        createTimeline('#timeline-inner', report.words_count[d.index][3]);

        window.wordCollectionClearCards();
        news = report.words_count[d.index][2];
        dict = {};
        for (i in mediaEN) {
          dict[mediaEN[i]] = {};
          dict[mediaEN[i]].count = 0;
          dict[mediaEN[i]].provocativeNum = 0;
          dict[mediaEN[i]].IsMoreThanFive = false;
        }
        for (var i in news) {
          media = mediaNameTranslate(news[i].media);
          if (news[i].isProvocative === true)
            dict[media].provocativeNum++
            if (dict[media].count < NUM_OF_SHOWED_NEWS && news[i].isProvocative === true) {
              window.wordCollectionAddNewsCard(media, news[i].title, '', news[i].url, true);
              dict[media].count++;
            } else if (dict[media].count < NUM_OF_SHOWED_NEWS && news[i].isProvocative === false) {
            nonProvocativeNewses.push(news[i])
          } else if (dict[media].count >= NUM_OF_SHOWED_NEWS) {
            dict[media].IsMoreThanFive = true;
            dict[media].count++;
          }
        }

        for (var i in nonProvocativeNewses) {
          var news = nonProvocativeNewses[i]
          media = mediaNameTranslate(news.media);
          if (dict[media].count < NUM_OF_SHOWED_NEWS) {
            window.wordCollectionAddNewsCard(mediaNameTranslate(news.media), news.title, '', news.url, false);
            dict[media].count++;
          } else if (dict[media].count >= NUM_OF_SHOWED_NEWS) {
            dict[media].IsMoreThanFive = true;
            dict[media].count++;
          }
        }

        for (i in mediaEN) {
          var newsItem = dict[mediaEN[i]]
          if (newsItem.IsMoreThanFive) {
            window.wordCollectionAddNewsNum(mediaEN[i], newsItem.count - NUM_OF_SHOWED_NEWS + 1);
          }
          if (newsItem.provocativeNum >= 1) {
            wordCollectionAddProvocativeNum(mediaEN[i], parseFloat(newsItem.provocativeNum * 100 / newsItem.count).toFixed(1))
          }
        }

        $('#qurey-word').text(d.text)
      });

    //Entering and existing words
    cloud
      .transition()
      .duration(600)
      .style('font-size', function (d) {
        return d.size + 'px';
      })
      .attr('transform', function (d) {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
      })
      .style('fill-opacity', 1);

    //Exiting words
    cloud.exit()
      .transition()
      .duration(200)
      .style('fill-opacity', 1e-6)
      .attr('font-size', 1)
      .remove();
  }


  //Use the module pattern to encapsulate the visualisation code. We'll
  // expose only the parts that need to be public.
  return {

    //Recompute the word cloud for a new set of words. This method will
    // asycnhronously call draw when the layout has been computed.
    //The outside world will need to call this function, so make it part
    // of the wordCloud return value.
    update: function (words) {
      d3.layout.cloud()
        .size([width, 500])
        .words(words)
        .padding(2)
        .rotate(function () {
          return Math.random() * 90 - 45;
        })
        .font('Impact')
        .fontSize(function (d) {
          return d.size;
        })
        .on('end', draw)
        .start();
    }
  }
}


function showNewWords(vis, i) {
  max = report.words_count[0][1];
  scale = max / 70;
  cloudConfig = report.words_count.map(function (obj, index) {
    return {
      text: obj[0],
      size: (10 + obj[1] / scale),
      index: index
    };
  });
  vis.update(cloudConfig);
}