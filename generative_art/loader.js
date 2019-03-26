/*
    Loads the WebPPL code from model.js and runs it.
    Run the entire application on a server (eg. Node's http-server/live-server).
    Remember to clear browser cache to see changes!
*/

$(document).ready(function(){
    let full_width = $(window).width();
    let full_height = $(window).height();
    
    let svg = d3.select("#svgdiv")
        .append("svg")
        .attr("width", 3*full_width/4)
        .attr("height", 3*full_height/4);

    console.log(SLS);
    start_tree();
});

/* Reset the tree, and start drawing again. */
$("#reset").click(function(){
    d3.select("svg").selectAll("*").remove();
    start_tree();
    console.log("Tree reset.");
});

/* Run the WebPPL model to draw the tree. */
function start_tree(){
    $.get("./model.js", function (model_string) {
        webppl.run(model_string, function (s, x) { console.log(s); }, { debug: true });
    }, 'text');
}

/* Stochastic L-System. */
let SLS = {
    axiom: "X",
    rules: [
        ruleF = {
            init: "F",
            final: ["FF", "FF", "FF", "FF"],
        },
        ruleX = {
            init: "X",
            final: ["F+[[XS]-XS]--F[-FXS]+XS", "F+[[XXS]-XS]--F[-FXX]+XS"],
        }, 
        ruleS = {
            init: "S",
            final: ["[F[++L][+L][L][-L][--L]]", "[F[+L][L][-L]]", "[F[+++L][++L][+L][L][-L][--L][--L]]"],
        },
        ruleL = {
            init: "L",
            final: ["L", "L[+L][-L]", "L[++L][+L][-L][--L]", "LL"],
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
