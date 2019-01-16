let svg = d3.select("svg");
let box_width = svg.attr("width");
let box_height = svg.attr("height");

globalStore.curr_line = 0;
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
        .delay(20 * globalStore.curr_line)
        .style("stroke-opacity", 1);

    globalStore.curr_line += 1;
}

let draw_tree = function(box_x, box_y){
    let root_start_x = box_x + box_width/2;
    let root_start_y = box_y + 3 * box_height/4;

    let root_length = uniform(10, 20);
    let root_width = 8;
    let root_end_x = root_start_x;
    let root_end_y = root_start_y - root_length;

    draw_line(root_start_x, root_start_y, root_end_x, root_end_y, root_width, "brown");
    draw_branch(root_end_x, root_end_y, root_length, Math.PI/2, root_width);
}

let draw_branch = function(start_x, start_y, prev_length, prev_angle, prev_width){
    let length = prev_length * uniform(0.9, 1);
    let width = prev_width * uniform(0.9, 1);
    let angle = prev_angle + uniform(-Math.PI/5, Math.PI/5);
    let end_x = start_x + length * Math.cos(angle);
    let end_y = start_y - length * Math.sin(angle);

    draw_line(start_x, start_y, end_x, end_y, width, "brown");

    if(width < 1){
        draw_leaves(end_x, end_y, angle);
    } else {
        if (width >= 1 && width < 1.05) {
            draw_branch(end_x, end_y, length, angle, width);
            draw_branch(end_x, end_y, length, angle, width);
        } else {
            if (flip(0.15)) {
                draw_branch(end_x, end_y, length, angle, width);
                draw_branch(end_x, end_y, length, angle, width);
            } else {
                draw_branch(end_x, end_y, length, angle, width);
            }
        }
    }
    
}

let draw_leaves = function(start_x, start_y, start_angle){
    let num_leaves = 4 + randomInteger(3);
    draw_leaves_helper(start_x, start_y, start_angle, num_leaves, 0);
}

let draw_leaves_helper = function(start_x, start_y, start_angle, num_leaves, curr_leaf){

    if(num_leaves == curr_leaf) {
        return;
    }

    let length = 10;
    let angle = start_angle + (2 * curr_leaf - num_leaves) * Math.PI/(2.5 * num_leaves);
    let end_x = start_x + length * Math.cos(angle);
    let end_y = start_y - length * Math.sin(angle);

    draw_line(start_x, start_y, end_x, end_y, 0.8, "green");
    draw_leaves_helper(start_x, start_y, start_angle, num_leaves, curr_leaf + 1);
}

draw_tree(0, 0);
