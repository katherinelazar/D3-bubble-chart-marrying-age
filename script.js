
// Load in csv data containing worldwide statistics on rates of the 
// use of contraception and average age of womens' first marriage
d3.csv('Data-Table 1.csv', function(error, data) {
    if (error) {
        console.error('Error fetching data');
        throw error;
    }

    // Call function to create bubble chart and scatterplot, pass data
    var chart = bubbleChart();
    d3.select('#chart').data(data).call(chart);

    var chart = scatterPlot();
    d3.select('#plot').data(data).call(chart);

});

// Initialize all variables; make SVG width and height size of browser window
var 
    margin = {top: 300, right: 70, bottom: 0, left: 70},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom,
    maxRadius = 35,
    heightPadding = 300,
    plotOffset = -100,
    heightOffset = 100;
    titleY = -240;
    
var colorCircles = d3.scaleOrdinal(d3.schemeCategory20); // or 20c looks nice
var twoDec = d3.format(".2f");
var oneDec = d3.format(".1f");

function scatterPlot() {

    var
        columnForTitle = "plot_countries",
        columnForXaxis = "plot_ages",
        columnForYaxis = "contraceptive_use",
        opacity = .4,
        minRadius = 15,
        cxMultiplier = .52,
        cyMultiplier = 1.07,
        showTitleOnCircle = true;

    // Function takes in csv data, plots a circle on axis for each point of data
    function chart(selection) {
        var data = selection.enter().data();
        chartSelection = selection;
        var div = selection;

        // Create our single scaleable vector graphic, SVG
        var svg = div.append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom + heightPadding)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // y-axis scale, domain takes in max and min of data, and range gives size in pixels
        var contraceptiveUseScale = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return +d[columnForYaxis];}), 
                d3.max(data, function(d) { return +d[columnForYaxis];})])
            .range([height, plotOffset]);

        // x-axis scale, domain takes in max and min of data, range gives size in pixels
        var ageScale = d3.scaleLinear()
                .domain([d3.min(data, function(d) { return +d[columnForXaxis] + minRadius;}),
                    d3.max(data, function(d) { return +d[columnForXaxis];})])
                .range([minRadius, width - heightOffset]);

        // Bubble radius also varies based on "age" variable from csv
        var radiusScale = d3.scaleLinear()
                .domain([d3.min(data, function(d) { return +d[columnForXaxis];}),
                    d3.max(data, function(d) { return +d[columnForXaxis];})])
                .range([minRadius, maxRadius]);

        // Create y axis
        var yAxis = d3.axisLeft()
            .scale(contraceptiveUseScale)
            .ticks(20);

        // Create x axis
        var xAxis = d3.axisBottom()
            .scale(ageScale)
            .ticks(40);

        // Append title to chart
        svg.append('text')
            .attr("class", "chart-title")
            .attr('x', 0)
            .attr('y', titleY)
            .text("Marrying age and contraceptive use");

        // Append the x axis to svg
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(35," + (height - heightOffset) + ")")
            .call(xAxis);

        // Append the y axis to svg
        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + .5 * heightOffset + ", -100)")
            .call(yAxis);

        // Add the text label for the x axis
        svg.append("text")
            .attr("id", "axis-labels")
            .attr("transform", "translate(" + (width / 2) + " ," + (height  - maxRadius) + ")")
            .text("Average age of first marriage");

        // Add the text label for y axis
        svg.append("text")
            .attr("id", "axis-labels")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", titleY / 4)
            .text("% use of contraception");

        // Initialize tooltip to display information
        var tooltip = selection
            .append("div")
            .attr("class", "tooltip")
            .text("");

        // Create new circle
        var node = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("g")
            .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
            .style('opacity', opacity);

        // Append circle, and feed in data for radius, x, and y, as well as mouseover styling of tooltip and stroke of bubble
        node.append("circle")
            .attr("class", "bubble")
            .attr("id",function(d, i) {
                return i;
            })
            .attr('r', function(d) {
                return radiusScale(+d[columnForXaxis]) * (1/2);
            })
            .attr("cx", function(d) {
                return ageScale(d[columnForXaxis]) - (cxMultiplier * (width - heightOffset - minRadius)); 
            })
            .attr("cy", function(d) {
                return contraceptiveUseScale(d[columnForYaxis]) - (cyMultiplier * (plotOffset + height));
            })
            .style("fill", function(d, i) {
                return colorCircles(i);
            })
            .on("mouseover", function(d) {
                tooltip.html(d[columnForTitle] + "    " + twoDec(d[columnForXaxis]) + " years and " + oneDec(d[columnForYaxis]) + "%")
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .75);
                d3.select(this).style("stroke", "black");
            })
            .on("mousemove", function() {
                d3.select(this).style("stroke", "black")
                tooltip.style("opacity", .75)
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).style("stroke", "white")
                return tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        // If we want to display country names, we ensure that tooltip appears over text as well
        if (showTitleOnCircle) {
            node.append("text") 
                .attr("class", "bubble-label")
                .attr("x",function(d) {
                    return ageScale(d[columnForXaxis]) - (.52 * (width - heightOffset - minRadius));
                })
                .attr("y",function(d) {
                    return contraceptiveUseScale(d[columnForYaxis]) - (1.07 * (plotOffset + height) - 3);
                })
                .text(function(d) {
                    return d[columnForTitle];
                })
                .on("mouseover", function(d) {
                    tooltip.html(d[columnForTitle] + "    " + twoDec(d[columnForXaxis]) + " years and " + oneDec(d[columnForYaxis]) + "%") 
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .75);
                })
                .on("mousemove", function() {
                    tooltip.style("opacity", .75);
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function() {
                    return tooltip.transition()
                        .duration(200)
                        .style("opacity", 0);
                });   
        } 
    }
    // Send back chart to be displayed in browser
    return chart;
}

// Create bubble chart that first appears when browser is opened
function bubbleChart() {
    var 
        columnForTitle = "Country",
        columnForRadius = "age",
        forceApart = -75,
        opacity = .5,
        minRadius = 0,
        showTitleOnCircle = true;

    // Function takes in csv data, creates a circle for each point of data
    function chart(selection) {
        var data = selection.enter().data();
        chartSelection = selection;
        var div = selection;

        // Specify size of bubbles based on 'age' column in csv
        var minRadiusDomain = d3.min(data, function(d) {
            return +d[columnForRadius];
        });
        var maxRadiusDomain = d3.max(data, function(d) {
            return +d[columnForRadius];
        });

        // Create svg that fits screen size
        var svg = div.append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom + heightPadding)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add title to svg (bubble chart)
        svg.append('text')
            .attr("class", "chart-title")
            .attr('x', 0)
            .attr('y', titleY)
            .text("At what age do women marry?");

        // Add hover-over tooltip to display information
        var tooltip = selection
            .append("div")
            .attr("class", "tooltip")
            .text("");

        // Add force between bubbles that pushes them apart when browser is opened
        var simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength([forceApart]))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);

        // Moves each bubble during animation
        function ticked(e) {
            node.attr("transform",function(d) {
                return "translate(" + [d.x + (width / 2), d.y + ((height) / 2)] + ")"; //+ margin.top
            });
        }

        // Scale up our radius domain a bit, to exaggerate difference in size of bubbles
        var scaleRadius = d3.scalePow()
            .exponent(1.5)
            .domain([minRadiusDomain, maxRadiusDomain])
            .range([minRadius, maxRadius])

        // Create a new circle
        var node = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("g")
            .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
            .style('opacity', opacity);

        // Append circle to svg, use our predefined scale to determine its size. Specify radius, tooltip styling on mouseover
        node.append("circle")
            .attr("class", "bubble")
            .attr("id",function(d, i) {
                return i;
            })
            .attr('r', function(d) {
                return scaleRadius(d[columnForRadius]);
            })
            .style("fill", function(d, i) {
                return colorCircles(i);
            })
            .on("mouseover", function(d) {
                d3.select(this).style("stroke", "black")
                tooltip.html(d[columnForTitle] + "    " + twoDec(d[columnForRadius]) + " years"); 
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                d3.select(this).style("stroke", "black")
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).style("stroke", "white")
                return tooltip.style("visibility", "hidden");
            });

            // Add node to path of our svg shape (which is more or less a blob), this way we keep track of where each circle lies in space
        node.append("clipPath")
            .attr("id",function(d, i) {
                return "clip-" + i;
            })
            .append("use")
            .attr("xlink:href",function(d, i) {
                return "#" + i;
            });

        // If we're showing country names, we append text from Age column and make sure tooltip remains visible on mouseover
        if (showTitleOnCircle) {
            node.append("text")
                .attr("class", "bubble-label")
                .attr("clip-path",function(d, i) {
                    return "url(#clip-" + i + ")"
                })
                .attr("text-anchor", "middle")
                .append("tspan")
                .attr("x",function(d) {
                    return 0;
                })
                .attr("y",function(d) {
                    return ".3em";
                })
                .text(function(d) {
                    return d[columnForTitle];
                })
                .on("mouseover", function(d) {
                    tooltip.html(d[columnForTitle] + "    " + twoDec(d[columnForRadius]) + " years"); 
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function() {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function() {
                    return tooltip.style("visibility", "hidden");
                });
        } 
    }
    // Return bubble chart to be displayed in browser
    return chart;
}

