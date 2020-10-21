# lab5
d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    //data = data.sort((a, b) => d3.descending(a.stores, b.stores));
    console.log('coffee house chains', data);

    // create svg with margin convention //
    const margin = ({top: 20, right: 20, bottom: 20, left: 50});
	const width = 630 - margin.left - margin.right;
	const height = 600 - margin.top - margin.bottom;
	const svg = d3.select(".chart")
		.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
	  	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create scales //
	const xScale = d3
		.scaleBand()
        .domain(data.map(d=>d.company))
        .rangeRound([0, 550])
        .paddingInner(0.1);
        //d3.extent(data, d=>d.company)///['Starbucks', 'Tim Hortons', 'Panera Bread', 'Costa Coffee', 'Dunkin Brands', 'Krispy Kreme', 'Caffé Nero', 'Einstein Noah']
        
	const yScale = d3
		.scaleLinear()
		.domain(d3.extent(data, d=>d.stores))
        .range([550,0]);
    //console.log('stores scale', );
		
	const xAxis = d3.axisBottom()
		.scale(xScale);

    const yAxis = d3.axisLeft()
		.scale(yScale);
   
    //Draw Axis
    svg.append("g")//X
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${width})`)
		.call(xAxis);
	
    svg.append("g")//Y
        .attr("class", "axis y-axis")
        
        //.attr("transform", `translate(${height},0)`)
		.call(yAxis);

    // create bars //
    svg.selectAll('rect')
        .data(data)
		.enter()
		.append('rect')
		.attr('x', (d,i)=>(i * 69))
		.attr('width', xScale.bandwidth())
		.attr('y', d=>yScale(d.stores))//.attr('y', (d,i)=>(i * width/data.length) + 10)
		.attr('height', d=>height-yScale(d.stores))
		.attr("fill", "blue")
		.attr('class', 'bar');

    // create axes and axis title //
    //Y-Axis Label
    svg.append('text')
    .attr('x', 0)
    .attr('y', -5)
    .attr('font-size','12px')
    //.attr("transform", "rotate(90)")
    .style("text-anchor", "front")
    .text("Stores");
});