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
      .data(words, function(d) {
        return d.text;
      })

    var getColor = function(d) {
        var max = 0;
        var key;
        var word_data = report.words_count[d.index][3]
        //find the media has greatest words_appear_ratio
        for (var i in media) {
          var words_appear_count = 0;
          for (var j in word_data){
            if(word_data[j].website === media[i])
              words_appear_count += word_data[j].count;
          }
          var totoal_news_count = report[media[i]].news_count;
          var words_appear_ratio = words_appear_count / totoal_news_count;
          if (words_appear_ratio > max) {
            max = words_appear_ratio;
            key = media[i];
          }
        }
        return mediaColor[key];
      }
      //Entering words
    cloud.enter()
      .append('text')
      .style('font-family', 'Impact')
      .style('fill', function(d, i) {
        return (d.size > 21 ? getColor(d) : 'lightgrey')
      })
      .style('font-weight', function(d) {
        return (d.size > 16 ? 600 : 100)
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', 1)
      .attr('cursor', 'pointer')
      .text(function(d) {
        return d.text;
      }).on('click', function(d) {
        // add word collection
        var offset = $('#timeline').offset();
        $('body,html').animate({ scrollTop: offset.top - 25 }, 'slow');
        createTimeline('#timeline-inner', report.words_count[d.index][3]);

        window.wordCollectionClearCards();
        news = report.words_count[d.index][2];
        dict = {};
        for (i in mediaEN) {
          dict[mediaEN[i]] = {};
          dict[mediaEN[i]].count = 0;
          dict[mediaEN[i]].IsMoreThanFive = false;
        }
        for (var i in news) {
          media = mediaNameTranslate(news[i].media);
          dict[media].count++;
          if (dict[media].count < 5) {
            window.wordCollectionAddNewsCard(media, news[i].title, '', news[i].url);
          } else if (dict[media].count == 5) {
            dict[media].IsMoreThanFive = true;
          }
        }
        for (i in mediaEN) {
          if (dict[mediaEN[i]].IsMoreThanFive)
            window.wordCollectionAddNewsNum(mediaEN[i], dict[mediaEN[i]].count - 4);
        }
        $('#qurey-word').text(d.text)
        $('#word-collection').removeClass('show');
        $('#timeline').removeClass('show');
      });

    //Entering and existing words
    cloud
      .transition()
      .duration(600)
      .style('font-size', function(d) {
        return d.size + 'px';
      })
      .attr('transform', function(d) {
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
    update: function(words) {
      d3.layout.cloud()
        .size([width, 500])
        .words(words)
        .padding(2)
        .rotate(function() {
          return Math.random() * 90 - 45;
        })
        .font('Impact')
        .fontSize(function(d) {
          return d.size;
        })
        .on('end', draw)
        .start();
    }
  }
}


function showNewWords(vis, i) {
  max = report.words_count[0][1];
  scale = max / 100;
  cloudConfig = report.words_count.map(function(obj, index) {
    return { text: obj[0], size: (10 + obj[1] / scale), index: index };
  });
  vis.update(cloudConfig);
}
