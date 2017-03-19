function createCategory(data) {
  // TODO 
  // 1. sort data
  // 2. prettifier

  console.log(data);

  var width = 880,
    height = 1000,
    padding = 6, // separation between nodes
    maxRadius = 12;

  var n = 200, // total number of nodes
    m = 5; // number of distinct clusters

  var color = function(mediaChineseName) {
    return mediaColor[mediaChineseName];
  };

  var nodes = []
  var counter;
  var numOfCategory = Object.keys(data).map(function(d) {
      return Object.keys(data[d].category).length
    })
    // var maxOfCategoryNum = Math.max.apply(null, numOfCategory);

  var i = 0;
  var TitleHeight = 2;
  var CategoryToDisplay = 12
  for (var d in data) {
    var dataNode = [];
    var y = d3.scale.ordinal()
      // .domain(d3.range(maxOfCategoryNum + 4))
      .domain(d3.range(CategoryToDisplay + TitleHeight))
      .rangePoints([40, height], 1);

    counter = 0;

    /*Title node*/
    nodes.push({
      radius: Math.sqrt(data[d].news_count) * maxRadius / 7,
      color: color(d),
      cx: i * 180 + 90,
      x: i * 180 + 90,
      cy: y(counter),
      y: y(counter),
      name: d,
      count: data[d].news_count
    });
    counter += TitleHeight;

    /*category node*/
    for (o in data[d].category) {
      if (counter > 12)
        break;
      dataNode.push({
        radius: Math.sqrt(data[d].category[o]) * maxRadius / 7,
        color: color(d),
        cx: i * 180 + 90,
        x: i * 180 + 90,
        name: o,
        count: data[d].category[o]
      });
      counter++;
    }
    dataNode.sort(function(x, y) {
      return d3.descending(x.count, y.count);
    })

    dataNode.forEach(function(value, i) {
      value.cy = y(i + TitleHeight);
      value.y = y(i + TitleHeight);
      value.order = i;
    });
    nodes = nodes.concat(dataNode);
    i++;
  }

  var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .on('tick', tick)
    .start();

  var svg = d3.select('#category').append('svg')
    .attr('width', width)
    .attr('height', height);

  var g = svg.selectAll('circle')
    .data(nodes)
    .enter();

  var circle = g.append('circle')
    .attr('r', function(d) {
      return d.radius; })
    .style('fill', function(d) {
      return media.indexOf(d.name) === -1 ? 'none' : d.color;
    })
    .style('stroke', function(d) {
      return media.indexOf(d.name) === -1 ? d.color : '#D3D3D3';
    })
    .style('stroke-width', function(d) {
      return media.indexOf(d.name) === -1 ? 2 : 2;
    })
    .call(force.drag);

  svg.selectAll('circle').style('opacity', function(d) {
    return (9 - ((d.order) ? d.order : 0)) * 0.08;
  });


  // This is the circles animation

  // circle.transition()
  //   .duration(3000)
  //   .delay(function(d, i) { return i * 5; })
  //   .attrTween('r', function(d) {
  //     var i = d3.interpolate(0, d.radius);
  //     return function(t) { return d.radius = i(t); };
  //   });

  var textLabel = g.append('text')
    .text(function(d) {
      return d.name;
    })
    .attr('x', function(d) {
      return media.indexOf(d.name) === -1 ? d.x + 5 : d.x - 40;
    })
    .attr('y', function(d) {
      return d.y;
    })
    .style('font-weight', function(d) {
      return media.indexOf(d.name) === -1 ? '' : '600';
    })
    .style('font-size', function(d) {
      return media.indexOf(d.name) === -1 ? '' : '20px';
    })
    .style('fill', 'rgba(0,0,0,0.75)');

  var countLabel = g.append('text')
    .text(function(d) {
      return d.count + '則';
    })
    .attr('x', function(d) {
      return media.indexOf(d.name) === -1 ? d.x + 5 : d.x - 40;
    })
    .attr('y', function(d) {
      return d.y + 20;
    })
    .style('fill', 'rgba(0,0,0,0.75)');

  function tick(e) {
    circle
      .each(gravity(.9 * e.alpha))
      .each(collide(.5))
      .attr('cx', function(d) {
        return d.x - 20;
      })
      .attr('cy', function(d) {
        return d.y;
      });

    textLabel.attr('x', function(d) {
        return media.indexOf(d.name) === -1 ? d.x : d.x - 40;
      })
      .attr('y', function(d) {
        return d.y;
      });

    countLabel.attr('x', function(d) {
      return media.indexOf(d.name) === -1 ? d.x : d.x - 40;
    })
      .attr('y', function(d) {
        return d.y + 20;
      })
  }

  // Move nodes toward cluster focus.
  function gravity(alpha) {
    return function(d) {
      d.y += (d.cy - d.y) * alpha;
      d.x += (d.cx - d.x) * alpha;
    };
  }

  // Resolve collisions between nodes.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function(d) {
      var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }

}
