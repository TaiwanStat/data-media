function createNewsBarChart(selector, data) {

  var margin = {
    top: 20,
    right: 20,
    bottom: 80,
    left: 20
  };
  var bandWidth = $('.band').width() > 768 ? 768 : $('.band-inner').width();
  var barWidth = bandWidth- margin.left - margin.right;
  var barHeight = 200 - margin.top - margin.bottom;

  var barSvg = d3.select(selector).append('svg')
    .attr('width', barWidth + margin.left + margin.right)
    .attr('height', barHeight + margin.top + margin.bottom);

  var tickPad = 4

  barSvg = barSvg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var titles = data.map(function(d) {
    return d.title;
  });

  var x = d3.scale.ordinal().rangeRoundBands([0, barWidth], .05);
  var y = d3.scale.linear().range([barHeight, 0]);

  x.domain(data.map(function (d) {
    return d.title;
  }))
  y.domain([0, d3.max(data, function (d) {
    return d.newsCount;
  })])

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickPadding(tickPad)
    .orient('bottom')
    

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    

  var bars = barSvg.selectAll('.bar').data(data).enter()
    .append('g').attr('class', 'bar')

  var bar = bars.append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) {
      return x(d.title) + x.rangeBand()/2 - 15/2;
    })
    .attr('y', y(0))
    .attr('width', 15)
    .attr('height', barHeight -  y(0) )
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('fill', function(d) {
      return mediaColor[d.title];
    })

  var xAxisTickTransform = ''
  var tipSize = ''
  var textAnchor = 'middle'
  if (barWidth < 600) {
    xAxisTickTransform += 'rotate(45)'
    tipSize = '0.7rem'
    textAnchor = 'start'
  }

  bars.append('text').text(function(d) {
      return d.newsCount + '篇';
    })
    .attr('x', function(d) {
      return x(d.title) + 10 + x.rangeBand() / 2 - 15 / 2;
    })
    .attr('y', function(d) {
      return y(d.newsCount) - 8;
    })
    .attr('text-anchor', 'middle')
    .attr('class', 'bartip')
    .attr('font-size', tipSize);



  barSvg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (barHeight + tickPad) + ')')
    .call(xAxis)
    .selectAll('text')
    .style("text-anchor", textAnchor)
    .attr('transform', xAxisTickTransform)
    .attr('font-size', tipSize);;


  bar.transition()
    .delay(function(d, i) {
      return i * 60 + 100;
    })
    .duration(1200)
    .ease('quad')
    .attr('y', function (d) {
      return y(d.newsCount)
    })
    .attr('height', function (d) { return barHeight - y(d.newsCount) })
}