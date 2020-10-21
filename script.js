// CHART INIT ------------------------------
// console.log("Selected Node: ", type)
const margin = ({top: 20, right: 20, bottom: 20, left: 50});
const width = 630 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const svg = d3.select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create scales WITHOUT domains
let xScale = d3
    .scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);
let yScale = d3
    .scaleLinear()
    .range([height,0]);
///////console.log("X DOMAIN INIT: ", xScale.domain)
// create axes and axis title containers
let xAxis = d3.axisBottom()
              .scale(xScale);
let yAxis = d3.axisLeft()
              .scale(yScale);

svg.append('g')//x axis
    .attr('class', 'axis x-axis')
    .attr("transform", `translate(0, ${height})`);      
svg.append('g')//y axis
    .attr('class', 'axis y-axis')
    .attr("transform", "translate(" + 0 + ", 0)");
svg.append("text")//y axis label
  .attr("class", "y-axis-title")
  .attr('x', 0)
  .attr('y', -5)
  .attr('font-size','12px')
  .style("text-anchor", "front");

// CHART UPDATES ---------------------------
let data = null;
d3.csv("coffee-house-chains.csv", d=>{ 
        return {...d, revenue: +d.revenue, stores: +d.stores};})
  .then(rev => {data = rev;
                update();});

  //event listener for dropdown
  dropdown = document.querySelector('#group-by');
  dropdown.addEventListener('change', function(){ return update();});


  //Handling the sorting direction change
  let sortChart = true;
  d3.select('.button').on('click', () => {sortChart = !sortChart; update();});


// CHART UPDATE FUNCTION -------------------
function update(){
    // create svg with margin convention //
    let type = document.querySelector('#group-by').value;

    console.log("update", data)
    // update domains
    // Sort data
  data.sort((a, b) => type == "stores"
    ? sortChart
      ? d3.descending(a.stores, b.stores)
      : d3.ascending(a.stores, b.stores)
    : sortChart
    ? d3.descending(a.revenue, b.revenue)
    : d3.ascending(a.revenue, b.revenue));
  
  xScale.domain(data.map(d => d.company));
  if (type == "stores") {
      let storesMax = d3.max(data, d => d.stores);
      yScale = d3
        .scaleLinear()
        .domain([0, storesMax])
        .range([height, 0]);
    }
  else {
      let revenueMax = d3.max(data, d => d.revenue);
      yScale = d3
        .scaleLinear()
        .domain([0, revenueMax])
        .range([height, 0]);
    }
  
  //console.log("X DOMAIN UPDATE: ", xScale.domain)
  // update bars
  // Implement the enter-update-exit sequence
  let bars = svg.selectAll('rect')
                .data(data, d=>{return d.company})
    
  bars.enter()
      .append('rect')
      .attr('class', 'bar')   
      .merge(bars)
      .transition()
      .duration(300)
      .attr("x", d => xScale(d.company))
      .transition()
      .duration(300)
      .attr("y", d => yScale(type == "stores" ? d.stores : d.revenue))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(type == "stores" ? d.stores : d.revenue));
  bars.exit()
      .remove();
  svg.exit().remove();

  // update axes and axis title
  xAxis.scale(xScale);
  yAxis.scale(yScale);
  
  svg.select('.x-axis')
    .transition()
    .duration(300)
    .call(xAxis);
  
  svg.select(".y-axis")
    .transition()
    .duration(300)
    .style('opacity', 0)
    .transition()
    .duration(300)
    .style('opacity', 1)
    .call(yAxis);
    
  if(type == 'stores'){
      svg.select('.y-axis-title')
          .text('Stores');
  }
  else{
      svg.select('.y-axis-title')
          .text('Billion USD');
  }      
}