function createTimeline(selector, data) {

  var margin = {
    top: 20,
    right: 100,
    bottom: 20,
    left: 50
  }

  var nav_width = 240
  var width
  var marginTimeline = 80

  if ($(window).width() > smallDesktopWidthSize) {
    width = $(window).width() - (nav_width + 2 * marginTimeline)
  } else {
    width = $(window).width() - 2 * marginTimeline
  }

  width = width > 960 ? 960 : width

  var svg = d3.select(selector).append('svg')
    .attr('width', width)
    .attr('height', 200)

  var width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /********multiline*/

  // Set the ranges
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

  // Define the line
  var line = d3.svg.line()
    .interpolate('monotone')
    .x(function(d) {
      return x(d.time);
    })
    .y(function(d) {
      return y(d.count);
    });

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
    var group
    var lastIndex = d.values.length - 1
    group = g.append("g").attr("class","lineGroup")
    group.append("path")
      .attr("class", "line")
      .attr("d", line(d.values))
      .attr("stroke", function() {
        return mediaColor[d.key]
      })
    for (var i in d.values) {
      group.append("circle")
        .attr("r", 5)
        .attr("cx", function() {
          return x(d.values[i].time);
        })
        .attr("cy", function() {
          return y(d.values[i].count);
        })
        .attr("fill", function() {
          return mediaColor[d.key]
        })
    }
    group.append("text")
      .attr("x",x(d.values[lastIndex].time)+5)
      .attr("y",y(d.values[lastIndex].count)+5)
      .attr("fill", mediaColor[d.key])
      .style("font-size","12px")
      .style("letter-spacing","2px")
      .style("font-weight","300")
      .text(d.key)
      
  });

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  g.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  /*TODO: 
        1. add label at the end of line
        2. dot animation
        3. legend
        4. scale
  */

}

var timelineData = []
for (var i = 23; i <= 30; i++) {
  for (var item in media) {
    timelineData.push({
      website: media[item],
      time: i,
      count: Math.round(Math.random() * 80 + 20)
    });
  }
}

createTimeline('#timeline-inner', timelineData)
