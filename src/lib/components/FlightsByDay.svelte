<script lang="ts">
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';
	import { select } from 'd3-selection';
	import { axisBottom, axisLeft } from 'd3-axis';
	import * as d3 from 'd3';

	import { selectedAircraft } from '$lib/stores';
	import { aircraftColors } from '../../utils/aicraftUtils';

	type FlightsByDay = {
		aircraft: string;
		day_of_week: string;
		total_hours: number;
	};

	let flightData: FlightsByDay[] = [];
	let planes: string[] = [];

	let svgWidth = 800;
	let svgHeight = 400;
	let margin = { top: 20, right: 30, bottom: 60, left: 40 };
	let width = svgWidth - margin.left - margin.right;
	let height = svgHeight - margin.top - margin.bottom;

	let svg;

	const getFlightsByDay = async (aircraft?: string) => {
		const url = aircraft ? `/api/flights-by-day?aircraft=${aircraft}` : `/api/flights-by-day`;
		const response = await fetch(url);
		const data = await response.json();
		return data;
	};

	const getAircrafts = async () => {
		const response = await fetch('/api/flight-aircrafts');
		const data = await response.json();
		return data;
	};

	$effect(() => {
		selectedAircraft.subscribe(async (aircraft) => {
			flightData = await getFlightsByDay(aircraft);
			planes = aircraft ? [aircraft] : await getAircrafts();
			drawChart();
		});
	});

	function drawChart() {
		// Clear existing SVG if any
		select('#flights-by-day-chart').selectAll('svg').remove();

		// Set up scales
		const x0 = scaleBand()
			.domain(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
			.rangeRound([0, width])
			.paddingInner(0.1);

		const x1 = scaleBand().domain(planes).rangeRound([0, x0.bandwidth()]).padding(0.05);

		const y = scaleLinear()
			.domain([0, max(flightData, (d) => parseFloat(d.total_hours.toString())) || 0])
			.nice()
			.range([height, 0]);

		// Set up SVG container
		svg = select('#flights-by-day-chart')
			.append('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Group data by day of the week
		const groupedData = d3.group(flightData, (d) => d.day_of_week);

		// Draw bars
		svg
			.selectAll('g.bar-group')
			.data(groupedData)
			.enter()
			.append('g')
			.attr('class', 'bar-group')
			.attr('transform', ([day]) => `translate(${x0(day)},0)`)
			.selectAll('rect')
			.data(([, values]) => values)
			.enter()
			.append('rect')
			.attr('x', (d) => x1(d.aircraft) ?? 0)
			.attr('y', (d) => (isNaN(y(d.total_hours)) ? 0 : y(d.total_hours)))
			.attr('width', x1.bandwidth())
			.attr('height', (d) => (isNaN(y(d.total_hours)) ? 0 : height - y(d.total_hours)))
			.attr('fill', (d) => aircraftColors[d.aircraft] || '#ccc');

		// Draw X axis
		svg
			.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${height})`)
			.call(axisBottom(x0))
			.selectAll('text')
			.style('text-anchor', 'end')
			.attr('dx', '-0.8em')
			.attr('dy', '0.15em')
			.attr('transform', 'rotate(-45)');

		// Draw Y axis
		svg.append('g').attr('class', 'y-axis').call(axisLeft(y));
	}
</script>

<div class="wrapper">
	<h2>Aircraft Utilization by Day of the Week</h2>
	<div id="flights-by-day-chart"></div>
</div>

<style>
	.wrapper {
		display: inline-block;
		border: 2px solid black;
		padding: 2rem;
	}

	svg {
		font-family: sans-serif;
		font-size: 10px;
	}

	.x-axis path,
	.x-axis line,
	.y-axis path,
	.y-axis line {
		fill: none;
		stroke: #000;
		shape-rendering: crispEdges;
	}

	.x-axis text,
	.y-axis text {
		fill: #000;
	}
</style>
