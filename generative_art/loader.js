$(document).ready(function(){
    let full_width = $(window).width();
    let full_height = $(window).height();
    
    let svg = d3.select("#svgdiv")
        .append("svg")
        .attr("width", full_width/2)
        .attr("height", full_height/2);
        
    start_tree();
});

$("#reset").click(function(){
    d3.select("svg").selectAll("*").remove();
    start_tree();
    console.log("Tree reset.");
});

function start_tree(){
    $.get("./model.js", function (model_string) {
        webppl.run(model_string, function (s, x) { console.log(s); }, { debug: true });
    }, 'text');
}
