function createTimeline(t,e){var a,n={top:20,right:50,bottom:20,left:50},r=240,i=80;a=$(window).width()>980?$(window).width()-(r+2*i):$(window).width()-2*i,a=a>960?960:a;var o=d3.select(t).append("svg").attr("width",a).attr("height",200),a=+o.attr("width")-n.left-n.right,l=+o.attr("height")-n.top-n.bottom,d=o.append("g").attr("transform","translate("+n.left+","+n.top+")");o=o.append("g").attr("width",a).attr("height",l).attr("transform","translate("+n.left+","+n.top+")");var s=d3.scale.linear().range([0,a]),c=d3.scale.linear().range([l,0]),m=d3.svg.axis().scale(s).orient("bottom").ticks(5),u=d3.svg.axis().scale(c).orient("left").ticks(5),f=d3.svg.line().interpolate("monotone").x(function(t){return s(t.time)}).y(function(t){return c(t.count)});s.domain(d3.extent(e,function(t){return t.time})),c.domain([0,d3.max(e,function(t){return t.count})]);var p=d3.nest().key(function(t){return t.website}).entries(e);p.forEach(function(t){o.append("path").attr("class","line").attr("d",f(t.values)).attr("stroke",function(){return mediaColor[t.key]})}),d.append("g").attr("class","x axis").attr("transform","translate(0,"+l+")").call(m),d.append("g").attr("class","y axis").call(u),d.selectAll("dot").data(e).enter().append("circle").attr("r",3.5).attr("cx",function(t){return s(t.time)}).attr("cy",function(t){return c(t.count)}).attr("fill",function(t){return mediaColor[t.website]})}for(var timelineData=[],i=23;i<=30;i++)for(var item in media)timelineData.push({website:media[item],time:i,count:Math.round(80*Math.random()+20)});createTimeline("#timeline",timelineData);