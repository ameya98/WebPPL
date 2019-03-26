let svg = d3.select("svg");
let box_width = svg.attr("width");
let box_height = svg.attr("height");

globalStore.curr_line = 0;
globalStore.statement = SLS.axiom;

// Till what depth to apply L-system rules.
let depth = 4;

// Tree parameters.
let start_width = 6;
let start_length = 15;
let start_pos = [box_width / 2, 3 * box_height / 4];
let start_angle = -Math.PI / 2;

// Updates globalStore.statement by applying the L-system rules once over it.
let make_next_statement = function () {
    let char_choices = map(SLS_apply_helper, globalStore.statement);
    let char_array = map(get_sample, char_choices);
    globalStore.statement = reduce(function (curr, next) { return curr + next; }, "", char_array);
}

// WebPPL won't allow JS functions directly as an argument to map().
let SLS_apply_helper = function (ch) {
    return SLS.apply(ch);
}

// Returns a choice from choice, uniformly picked.
let get_sample = function (choices) {
    return categorical({ vs: choices });
}

// Performs an action based on the character passed.
let perform_action = function(index, pos, angle, length, width){
     
    let ch = globalStore.statement.charAt(index);
    if(ch == 'F'){
        if (length > 2){
            // New position, as we move forward.
            let new_x = pos[0] + length * Math.cos(angle);
            let new_y = pos[1] + length * Math.sin(angle);
            let new_pos = [new_x, new_y];
        
            // Draw the branch.
            draw_line(pos[0], pos[1], new_pos[0], new_pos[1], width, "brown");

            let new_length = (width > 0.7 * start_width) ? length : length * uniform(0.95, 1);
            let new_width = (width < 0.3 * start_width) ? width : width * uniform(0.9, 1);

            // Go to the next character.
            if(index < globalStore.statement.length - 1){
                return perform_action(index + 1, new_pos, angle, new_length, new_width);
            }
        } else {
            return perform_action(index + 1, pos, angle, length, width);
        }

        return;
    } 

    if (ch == 'L') {
        // New position, as we move forward.
        let new_x = pos[0] + length * Math.cos(angle);
        let new_y = pos[1] + length * Math.sin(angle);
        let new_pos = [new_x, new_y];
    
        // Draw the leaf.
        draw_line(pos[0], pos[1], new_pos[0], new_pos[1], width/2, "green");

        // Go to the next character.
        if (index < globalStore.statement.length - 1) {
            return perform_action(index + 1, new_pos, angle, length, 2*width/3);
        }
    
        return;
    } 

    if (ch == 'X') {
        // No action for X.
        if (index < globalStore.statement.length - 1) {
            return perform_action(index + 1, pos, angle, length, width);
        }
        return;
    } 

    if (ch == 'S') {
        // No action for S.
        if (index < globalStore.statement.length - 1) {
            return perform_action(index + 1, pos, angle, length, width);
        }
        return;
    } 

    if (ch == '['){
        // Save current parameters.
        if (index < globalStore.statement.length - 1) {
            let new_index = perform_action(index + 1, pos, angle, length, width);
            return perform_action(new_index, pos, angle, length, width);
        }
        return;
    }

    if (ch == ']'){
        // Restore old parameters.
        if (index < globalStore.statement.length - 1) {
            return index + 1;
        }
        return;
    }

    if (ch == '+') {
        // Turn right by a random angle in the range 0 to pi/6.
        if (index < globalStore.statement.length - 1) {
            let new_angle = angle + uniform(Math.PI/8, Math.PI/7);
            return perform_action(index + 1, pos, new_angle, length, width);
        }
        return;
    } 

    if (ch == '-') {
        // Turn left by a random angle in the range 0 to pi/6.
        if (index < globalStore.statement.length - 1) {
            let new_angle = angle - uniform(Math.PI/8, Math.PI/7);
            return perform_action(index + 1, pos, new_angle, length, width);
        }
        return;
    } 
}

// Draw the tree recursively using globalStore.statement as a guide.
let draw_tree = function(){
    perform_action(0, start_pos, start_angle, start_length, start_width);
}

// Draw a line from position (x1, y1) to (x2, y2) with the given parameters.
let draw_line = function (x1, y1, x2, y2, width, colour) {
    svg.append("line")
        .attr("class", "tree")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke", colour)
        .style("stroke-width", width)
        .style("stroke-opacity", 0)
        .transition()
        .delay(10 * globalStore.curr_line)
        .style("stroke-opacity", 1);

    globalStore.curr_line += 1;
}

// Construct the statement by applying the stochastic L-system rules, until the given depth.
let get_statement = function(depth){
    if(depth == 0){
        return;
    } else {
        make_next_statement();
        display(globalStore.statement);
        get_statement(depth - 1);
    }
}

// Construct the L-system statement and draw the tree.
get_statement(depth);
draw_tree();