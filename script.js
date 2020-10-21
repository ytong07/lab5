// CHART INIT ------------------------------
// create svg with margin convention //
let type = document.querySelector('#group-by').value;

//console.log("Selected Node: ", type)

const margin = ({top: 20, right: 20, bottom: 20, left: 50});
const width = 630 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
const svg = d3.select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create scales WITHOUT domains
let xScale = d3
    .scaleBand()
    //.domain(data.map(d=>d.company))
    .rangeRound([0, height])
    .paddingInner(0.1);
let yScale = d3
    .scaleLinear()
    //.domain(d3.extent(data, d=>d.stores))
    .range([width,0]);
///////console.log("X DOMAIN INIT: ", xScale.domain)
// create axes and axis title containers
let xAxis = d3.axisBottom()
		.scale(xScale);
let yAxis = d3.axisLeft()
        .scale(yScale);

svg.append('g')//x axis
    .attr('class', 'axis x-axis')
    .attr("transform", `translate(0, ${width})`)
    .call(xAxis);      
svg.append('g')//y axis
    .attr('class', 'axis y-axis')
    .call(yAxis);
svg.append("text")//y axis label
  .attr("class", "y-axis-title")
  .attr('x', 0)
  .attr('y', -5)
  .attr('font-size','12px')
  .style("text-anchor", "front");

// (Later) Define update parameters: measure type, sorting direction!!!!!!!!!!!!!!!

// CHART UPDATE FUNCTION -------------------
function update(data,type){
	// update domains
    xScale.domain(data.map(d=>d.company));
    yScale.domain([0, d3.max(data, d=>d[type])]);//?????
    console.log("X DOMAIN UPDATE: ", xScale.domain)
    const bars = svg.selectAll('.bar')
                    .data(data);
    // update bars
    // Implement the enter-update-exit sequence
    //Make sure to add a data key function
    //(Hint: Use the company name as a key
    bars.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d,i)=>(i * 69))
        .attr('width', xScale.bandwidth())
        .attr('y', d=>yScale(d[type]))
        .attr('height', d=>height-yScale(d[type]))
        .attr("fill", "blue")
        .attr('class', 'bar');
    bars.exit().remove();
    bars.transition()
        .duration(1000)
        .attr('y', d=>yScale(d[type]))
        .attr('height', d=>height-yScale(d[type]))

    // update axes and axis title
    svg.select('.axis x-axis')
        //.attr("transform", `translate(0, ${width})`)
        .call(xAxis);
    svg.select('.axis y-axis')
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

// CHART UPDATES ---------------------------
d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    //console.log('type: ', typeof type,type);
    data = data.sort((a, b) => d3.descending(a[type], b[type]));
    //console.log('coffee house chains', data);
    update(data,type); // simply call the update function with the supplied data
    
    // (Later) Handling the type change
    dropdown = document.querySelector('#group-by');
    dropdown.addEventListener('change', function(){ type = dropdown.value});


    // (Later) Handling the sorting direction change
    let sortChart = () => {data.reverse();};
    window.onload = () => {document.getElementById('group-by').onclick = sortChart;}
});