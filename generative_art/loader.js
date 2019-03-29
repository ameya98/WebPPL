/*
    Loads the WebPPL code from model.js and runs it.
    Run the entire application on a server (eg. Node's http-server/live-server).
    Remember to clear browser cache to see changes!
*/

$(document).ready(function(){
    let full_width = $(window).width();
    let full_height = $(window).height();
    
    // Set SVG object.
    let svg = d3.select("#svgdiv")
        .append("svg")
        .attr("width", 3*full_width/4)
        .attr("height", 3*full_height/4);

    // Show L-system rules on page.
    text_string = "";
    for (rule of SLS.rules) {
        text_string += rule.init + ' → ' + rule.final.join(', ');
        text_string += '\n';
    }

    $('#rules').text(text_string);

    // Load WebPPL model to start drawing.
    load_model();

});

// Reset the tree, and start drawing again. 
$("#reset").click(function(){
    d3.select("svg").selectAll("*").remove();
    load_model();
    console.log("Tree reset.");
});

// Run the WebPPL model to draw the tree.
function load_model(){
    $.get("./model.js", function (model_string) {
        webppl.run(model_string, function (s, x) { console.log(s); }, { debug: true });
    }, 'text');
}

// Stochastic L-System. 
let SLS = {
    axiom: "X",
    rules: [
        ruleF = {
            init: "F",
            final: ["FF", "F"],
        },
        ruleX = {
            init: "X",
            final: ["F+-+[[X[[L][+L][-L]]]--X[[L][++L][--L]]]-F[-F[[L][+L][-L]]]+X[[L][+L][-L]]"],
        }, 
        ruleL = {
            init: "L",
            final: ["[L[++L][--L]]", "L"],
        }
    ],

    apply: function(ch){
        // Try to find a match with one of the rules.
        for (rule of this.rules){
            if(ch == rule.init){
                return rule.final;
            }
        }
        // No match found.
        return [ch];
    }
}

