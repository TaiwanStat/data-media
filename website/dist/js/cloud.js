function getRootElementFontSize(){return parseFloat(getComputedStyle(document.documentElement).fontSize)}function convertRem(t){return t*getRootElementFontSize()}function wordCloud(t){function e(t){var e=i.selectAll("g text").data(t,function(t){return t.text}),n=function(t){max=0,dict={};for(var e in media)tmp=report.words_count[t.index][3][media[e]].sum/report[media[e]].news_count,tmp>max&&(max=tmp,key=media[e]);return mediaColor[key]};e.enter().append("text").style("font-family","Impact").style("fill",function(t,e){return t.size>21?n(t):"lightgrey"}).style("font-weight",function(t){return t.size>16?600:100}).attr("text-anchor","middle").attr("font-size",1).attr("cursor","pointer").text(function(t){return t.text}).on("click",function(t){p1ClearCards(),news=report.words_count[t.index][2],dict={};for(e in mediaEN)dict[mediaEN[e]]=0;for(var e in news)media=mediaC2EN[news[e].media],dict[media]++,console.log(news[e].title+" "+media),dict[media]<5&&p1AddNewsCard(media,news[e].title,"",news[e].url)}),e.transition().duration(600).style("font-size",function(t){return t.size+"px"}).attr("transform",function(t){return"translate("+[t.x,t.y]+")rotate("+t.rotate+")"}).style("fill-opacity",1),e.exit().transition().duration(200).style("fill-opacity",1e-6).attr("font-size",1).remove()}var n,o=(d3.scale.category20(),240),r=80;n=$(window).width()>980?$(window).width()-(o+2*r):$(window).width()-2*r,n=n>960?960:n;var i=d3.select(t).append("svg").attr("width",n).attr("height",500).append("g").attr("transform","translate("+n/2+",250)");return{update:function(t){d3.layout.cloud().size([n,500]).words(t).padding(2).rotate(function(){return 90*Math.random()-45}).font("Impact").fontSize(function(t){return t.size}).on("end",e).start()}}}function showNewWords(t,e){max=report.words_count[0][1],scale=max/100,cloudConfig=report.words_count.map(function(t,e){return{text:t[0],size:10+t[1]/scale,index:e}}),t.update(cloudConfig)}