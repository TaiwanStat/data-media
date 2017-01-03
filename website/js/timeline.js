function createTimeline(selector, data) {

    var margin = {
        top: 20,
        right: 50,
        bottom: 20,
        left: 50
    }

    var nav_width = 240
    var width
    var marginTimeline = 80

    if ($(window).width() > 980) {
        width = $(window).width() - (nav_width + 2 * marginTimeline)
    }else{
        width = $(window).width() - 2 * marginTimeline
    }

    width = width > 960 ? 960 : width

    var svg = d3.select(selector).append('svg')
        .attr('width', width)
        .attr('height', 200)

    var width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg = svg.append('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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
            return x(d.time); })
        .y(function(d) {
            return y(d.count); });

    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]); 

    var dataNest = d3.nest()
        .key(function(d) {return d.website;})
        .entries(data);
    // Loop through each symbol / key
    dataNest.forEach(function(d) {
        svg.append("path")
            .attr("class", "line")
            .attr("d", line(d.values))
            .attr("stroke",function(){
            	return mediaColor[d.key]
            })
    });


    // media.append("text")
    //     .datum(function(d) {
    //         return { id: d.id, value: d.values[d.values.length - 1] };
    //     })
    //     .attr("transform", function(d) {
    //         return "translate(" + x(d.value.time) + "," + y(d.value.count) + ")";
    //     })
    //     .attr("x", 3)
    //     .attr("dy", "0.35em")
    //     .style("font", "10px sans-serif")
    //     .text(function(d) {
    //         return d.id;
    //     });

    /******************/

    // var x = d3.scale.linear()
    //     .rangeRound([0, width]);

    // var y = d3.scale.linear()
    //     .rangeRound([height, 0]);

    // // Define the axes
    // var xAxis = d3.svg.axis().scale(x)
    //     .orient("bottom").ticks(5);

    // var yAxis = d3.svg.axis().scale(y)
    //     .orient("left").ticks(5);

    // var line = d3.svg.line()
    //     .x(function(d) {
    //         return x(d.time);
    //     })
    //     .y(function(d) {
    //         return y(d.count);
    //     })
    //     .interpolate('monotone');;
    // x.domain(d3.extent(data, function(d) {
    //     return d.time;
    // }));

    // y.domain([0, d3.max(data, function(d) {
    //     return d.count;
    // })]);



    // // Add the valueline path.
    // g.append("path")
    //     .attr("class", "line")
    //     .attr("d", line(data))

    // Add the X Axis
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    g.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    g.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
            return x(d.time); })
        .attr("cy", function(d) {
            return y(d.count); })
        .attr("fill",function(d){
        	return mediaColor[d.website]
        })

        /*TODO: 
        1. add label at the end of line
        2. dot animation
        3. legend
        4. scale

    for(var item in media){
    	g.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[0].open) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "red")
		.text("Open");
    }*/

}
