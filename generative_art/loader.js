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
        .attr("height", 2.2*full_height/4);

    // Show L-system rules on page.
    text_string = "";
    for (rule of SLS.rules) {
        if(rule.display){
            text_string += rule.init + ' → ' + rule.final.join(', ');
            text_string += '\n';
        }
    }
    $('#rules').text(text_string);

    // Text to show when inference is going on.
    default_inferred_string = $('#inferreddepthdiv').text();

    // Reset when button clicked or depth changed.
    $("#reset").click(reset);
    $("input[name='radioset']").click(reset);

    // Load WebPPL model to start drawing.
    load_model();

});

// Reset the tree, and start drawing again. 
function reset() {
    d3.select("svg").selectAll("*").remove();
    $('#inferreddepthdiv').text(default_inferred_string);
    load_model();
    console.log("Tree reset.");
}


// Run the WebPPL model to draw the tree.
function load_model(){
    depth = parseInt($("input[name='radioset']:checked").val(), 10);
    
    $.get("./model.js", function (model_string) {
        webppl.run(model_string, function (s, x) { 
            $('#inferreddepthdiv').text("Inferred Depth: " + s.inferred_depth); 
        }, { debug: true });
    }, 'text');
}

// Stochastic L-System that guides the tree. 
let SLS = {
    axiom: "X",
    rules: [
        ruleF = {
            init: "F",
            final: ["FF", "F"],
            display: true,
        },
        ruleX = {
            init: "X",
            final: ["F+-+[[X[[L][+L][-L]]]--X[[L][++L][--L]]]-F[-F[[L][+L][-L]]]+X[[L][+L][-L]]"],
            display: true,
        }, 
        ruleL = {
            init: "L",
            final: ["[L[++L][--L]]", "L"],
            display: true,
        },
        ruleA = {
            init: "A",
            final: ["ABBBABBBBBBABBB"],
            display: false,
        },
        ruleB = {
            init: "B",
            final: ["BBB", "B"],
            display: false,
        },
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

// Till what depth to apply L-system rules.
let depth = 5;
let default_inferred_string = "";