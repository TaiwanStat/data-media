function createNewsBarChart(selector, data) {

  var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 50
  };
  var bandWidth = $('.band-inner').width() > 960 ? 960 : $('.band-inner').width()
  var remainWidth = bandWidth - $('#num-news').outerWidth(true) - $('#num-scale').outerWidth() - 50
  var barWidth = remainWidth
  var barHeight = $('.bar-container').height()

  var barSvg = d3.select(selector).append('svg')
    .attr('width', barWidth)
    .attr('height', barHeight)

  barSvg = barSvg.append('g')
    .attr('width', barWidth)
    .attr('height', barHeight)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var titles = data.map(function(d) {
    return d.title;
  });

  var x = d3.scale.linear().range([0, barWidth - 200]);
  var y = d3.scale.ordinal().rangeRoundBands([0, barHeight - 20], .05);

  x.domain([0, d3.max(data, function(d) {
    return d.newsCount;
  })])
  y.domain(data.map(function(d) {
    return d.title;
  }))

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('top')
    .tickSize(0)
    .ticks(0)
    .tickPadding(1)
    .tickFormat(d3.format('d'));;

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickSize(0)
    .tickPadding(-40);

  var bars = barSvg.selectAll('.bar').data(data).enter()
    .append('g').attr('class', 'bar')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var bar = bars.append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', function(d) {
      return y(d.title);
    })
    .attr('width', 0)
    .attr('height', 15)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('fill', function(d) {
      return mediaColor[d.title]
    })

  bars.append('text').text(function(d) {
      return d.newsCount + '件';
    })
    .attr('x', function(d) {
      return x(d.newsCount) + 10;
    })
    .attr('y', function(d) {
      return y(d.title) + 12;
    })
    .attr('class', 'bartip');

  barSvg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,0)')
    .call(xAxis);

  barSvg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + x(0) + ',0)')
    .call(yAxis);

  bar.transition()
    .delay(function(d, i) {
      return i * 60 + 100;
    })
    .duration(300)
    .ease('quad')
    .attr('width', function(d) {
      return x(d.newsCount) - x(0);
    });

}
