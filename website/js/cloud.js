//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html

// Encapsulate the word cloud functionality
var website =['聯合報','蘋果日報','自由時報','中央通訊社']

function wordCloud(selector) {

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 1280)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(640,250)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            // .style("fill", function(d, i) { return fill(i); })
            .style("fill", function(d, i) {
                return (d.size > 16 ? 'hsl('+Math.random()*360+', 100%,35%)' : 'dimgrey')
            })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

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
                .size([1280, 500])
                .words(words)
                .padding(2)
                .rotate(function() { return Math.random()*90-45; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }
}

function count (ary, classifier) {
    return ary.reduce(function(counter, item) {
        var p = (classifier || String)(item);
        counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
        return counter;
    }, {})
}

//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
    // word_counted = count(media_content[i].split(' '))
    word_counted = words[i]
    console.log(i)
    max = 0
    for(i in word_counted){
        if(word_counted[i][1]>max)
            max = word_counted[i][1]
    }
    scale = max/100
    console.log(scale)
    return word_counted.map(function(obj) {
               return {text: obj[0], size: (10+obj[1]/scale)};
            });
}

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
function showNewWords(vis, i) {
    i = i || 0;

    vis.update(getWords(i% words.length))
    setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
}


function readFile(){
    $.get("../../lib/data/data_seg.json",function(txt){
        words = txt

        //Start cycling through the demo data
        showNewWords(myWordCloud);
    })
}


//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud('div.cloud');
readFile()
