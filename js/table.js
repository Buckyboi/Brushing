//funciton that create a table 
function maketable() {
  let margin = {
      top: 60,
      left: 50,
      right: 30,
      bottom: 35
  },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    yValue = d => d[1],
    ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;
  function chart(selector,data, columns){

    let table = d3.select(selector).append('table')
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
    .classed("svg-content", true);
    let thead = table.append('thead')
    let tbody = table.append('tbody')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // append the header row
        thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function (column) { return column; });

        // create a row for each object in the data
        let rows = tbody.selectAll('tr')
        .data(data);

        rows.exit().remove();

        rows=rows.enter()
        .append('tr');


        // create a cell in each row for each column
        let cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
              return {column: column, value: row[column]};
          });
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value; });


        selectableElements = rows;


        d3.selectAll("tr")
        .on("mouseover", (d, i, elements) => {
          d3.select(elements[i]).style("background-color", "#a0ada3");
      })
        .on("mouseout", (d, i, elements) => {  
        d3.select(elements[i]).style("background-color", null);
      });

        table.call(brush);

            // Highlight rows when brushed
            function brush(g) {
              const brush = d3.brush()
              .on("start brush", highlight)
              .on("end", brushEnd)
              .extent([
                  [-margin.left, -margin.bottom],
                  [width + margin.right, height + margin.top]
                  ]);

              ourBrush = brush;

      g.call(brush); // Adds the brush to this element

      // Highlight the selected rows.
      function highlight() {
        if (d3.event.selection === null) return;
        d3.selectAll("tr").on("click",(d, i, elements) => {  
        d3.select(elements[i]).classed("selected");
      });

        // Get the name of our dispatcher's event
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

        // Let other charts know
        dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
    }

    function brushEnd() {
        // We don't want an infinite recursion
        if (d3.event.sourceEvent.type != "end") {
          d3.select(this).call(brush.move, null);
      }
  }
}
return chart;
}

chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
};

chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
};

chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
};


chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
};
// Gets or sets the dispatcher we use for selection events
chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
};

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    selectableElements.classed("selected", d =>
      selectedData.includes(d)
      );
};
return chart;
}