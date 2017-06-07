function plot(id, opts){
    opts = opts || {};

    var margin = {top: 20, right: 20, bottom: 40, left: 50},
        width = (opts.width || 500) - margin.left - margin.right,
        height = (opts.height || 300) - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width])
        .domain(opts.xlim || [0,1]);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain(opts.ylim || [0,1]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var clip = svg.append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("id", "clip-rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", width)
            .attr("height", height);

    var chart = svg.append("g")
        .attr("clip-path", "url(#clip)");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("dy", 30)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .text(opts.xlabel);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", -35)
        .attr("x", -height/2)
        .style("text-anchor", "middle")
        .text(opts.ylabel);

    var points = {};
    var lines = {};
    var imgs = {};
    var texts = {};
    function line(id, xData, yData){
        if(lines[id] !== undefined){lines[id].path.remove();}
        var data = xData.map(function(d, i) {
            return {x: parseFloat(xData[i]), y: parseFloat(yData[i]) };
        });
        var path = chart.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("id", id)
          .attr("d", d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); }));
        lines[id] = {path:path, data:data, rawData:{x:xData,y:yData}};
        return path;
    }

    function img(id, src, xLoc, yLoc, wLoc, hLoc){
        if(imgs[id] !== undefined){imgs[id].img.remove();}
        var img = chart.append("svg:image")
            .attr("xlink:href", src)
            .attr("id", id)
            .attr("x", x(xLoc))
            .attr("y", y(yLoc + hLoc))
            .attr("width", x(wLoc) - x(0))
            .attr("height", y(0) - y(hLoc));
        imgs[id] = {img:img, src:src, rawData:{x:xLoc, y:yLoc, width:wLoc, height:hLoc}};

    }

    function text(id, src, xLoc, yLoc){
        if(texts[id] !== undefined){texts[id].text.remove();}
        var text = chart.append("text")
            .attr("id", id)
            .attr("x", x(xLoc))
            .attr("y", y(yLoc))
            .text(src);
        texts[id] = {text:text, src:src, rawData:{x:xLoc, y:yLoc}};
    }
    return {svg:svg,chart:chart,x:x,y:y,margin:margin,width:width,height:height,
            line:line,img:img,text:text,
            lines:lines, points:points, imgs:imgs,texts:texts
            }
}
