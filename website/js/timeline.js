function createTimeline(selector, data) {

  var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 80
  };

  var width = $('.timeline-container').width()
  var height = $(window).height() / 5
  height = height < 200 ? 200 : height

  if( width < 480) {
    margin.left = 24
    margin.right = 24
    margin.bottom = 80
    height = 180
  }

  $(selector).empty();
  $(selector).append('<h3>報導次數時間軸</h3>');
  var svg = d3.select(selector).append('svg')
    .attr('width', width)
    .attr('height', height);

  width = +svg.attr('width') - margin.left - margin.right,
  height = +svg.attr('height') - margin.top - margin.bottom;

  var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  /* multiline */

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient('bottom').ticks(7).tickFormat(d3.time.format("%m/%d"));

  var yAxis = d3.svg.axis().scale(y)
    .orient('left').ticks(3);

  if( width < 980){
    xAxis.ticks(2)
    yAxis.ticks(2)
  }

  var parseTime = d3.time.format("%Y-%m-%d").parse;
  var parseTime_slash = d3.time.format("%Y/%m/%d").parse;

  data.map(function(i) {
    var formated_date = i.time;
    if (!(formated_date instanceof Date))
      formated_date = parseTime(i.time);
    if (!(formated_date instanceof Date)){
      formated_date = parseTime_slash(i.time);
    }
      
    i.time = formated_date
    return i;
  })

  data.sort(sortByDateAscending);
  // Define the line
  var line = d3.svg.line()
    .interpolate('monotone')
    .x(function(d) {
      return x(d.time);
    })
    .y(function(d) {
      return y(d.count);
    })
    


  x.domain(d3.extent(data, function(d) {
    return d.time;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.count;
  })]);

  var dataNest = d3.nest()
    .key(function(d) {
      return d.website;
    })
    .entries(data);
  // Loop through each symbol / key
  dataNest.forEach(function(d) {
    var group;
    var lastIndex = 0;
    group = g.append('g').attr('class', 'lineGroup');
    group.append('path')
      .attr('class', 'line')
      .attr('d', line(d.values))
      .attr('stroke', function() {
        return mediaColor[d.key];
      })
      .attr('class', 'timeline-line');
    for (var i in d.values) {
      group.append('circle')
        .attr('cx', function() {
          return x(d.values[i].time);
        })
        .attr('cy', function() {
          return y(d.values[i].count);
        })
        .attr('fill', function() {
          return mediaColor[d.key];
        })
        .attr('class', 'timeline-dot')
        .transition(1000);
    }
  });
  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .style('opacity', .6)
    .call(xAxis);

  var yLabel = g.append('text')
    .attr('x', -40)
    .attr('y', -15)
    .attr('fill', 'black')
    .style('font-size', '12px')
    .style('letter-spacing', '2px')
    .style('font-weight', '300')
    .style('opacity', 0)
    .text('報導次數（次）');
  
  var tips = g.append('g')
    .attr('class', 'tips')
    .attr("transform",
    "translate(20," +
    (height + margin.top) + ")")
    .style("text-anchor", "middle")
    .selectAll('g.tip').data(media).enter()
    .append('g')
    .attr('class', 'tip')
    .attr('transform', function (d, i) {
      var spacing = 8;
      var legend_width = (width / media.length + spacing)
      legend_width = (legend_width > 120 || legend_width < 80) ? 120 : legend_width
      var horz = (width / media.length + spacing) * i
      var vert = 0
      if( width < 480) {
        horz = (width / 3 + spacing) * (i%3)
        vert = Math.floor(i/3) * 16
      }
      
      return `translate(${horz},${vert})`
    })
  
  tips.append('circle')
    .attr('r', '6')
    .attr('cx', '-12')
    .attr('cy', '2')
    .style('fill', (d)=>mediaColor[d])

  tips.append('text').text((d)=>d)
    .attr('font-size', '12')
    .attr('dy', '6')
    .attr('text-anchor', 'start')
    .style('font-weight', '300')
    .style('fill', (d) => mediaColor[d])
  
  if (width >= 480) {

    var yAxisSvg = g.append('g')
      .attr('class', 'y axis')
      .style('opacity', 0)
      .call(yAxis);

    svg.on('mouseover', function () {
      yAxisSvg.transition().duration(200).style('opacity', 0.6)
      yLabel.transition().duration(200).style('opacity', 0.6)
    }).on('mouseout', function () {
      yAxisSvg.transition().duration(200).style('opacity', 0)
      yLabel.transition().duration(200).style('opacity', 0)
    })

  }


  // Because of the design purpose, temporily hide this
  // g.append('text')
  //   .attr('text-anchor', 'end')
  //   .attr('x', width + 12)
  //   .attr('y', height - 8)
  //   .attr('fill', 'black')
  //   .style('font-size', '12px')
  //   .style('letter-spacing', '2px')
  //   .style('font-weight', '300')
  //   .style('opacity', .6)
  //   .text('報導時間（日期）')


  /*TODO:
   * dot animation
   */

}

function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    return a.time - b.time;
}
