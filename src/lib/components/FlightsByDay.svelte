<script lang="ts">
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';
	import { select } from 'd3-selection';
	import { axisBottom, axisLeft } from 'd3-axis';
	import * as d3 from 'd3';

	import { selectedAircraft, selectedMonth } from '$lib/stores';
	import { aircraftColors } from '../../utils/aicraftUtils';

	type FlightsByDay = {
		aircraft: string;
		day_of_week: string;
		total_flights: number;
	};

	let flightData: FlightsByDay[] = [];
	let planes: string[] = [];
	let aircraft = $state<string | undefined>('');
	let month = $state<number | undefined>();

	let svgWidth = 800;
	let svgHeight = 400;
	let margin = { top: 20, right: 30, bottom: 60, left: 40 };
	let width = svgWidth - margin.left - margin.right;
	let height = svgHeight - margin.top - margin.bottom;

	let svg;

	const getFlightsByDay = async (aircraft?: string, month?: string) => {
		const url = aircraft
			? `/api/flights-by-day?aircraft=${aircraft}&month=${month}`
			: `/api/flights-by-day?month=${month}`;
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
		// Subscribe to both stores independently
		selectedAircraft.subscribe((value) => {
			aircraft = value;
			updateFlightData();
		});

		selectedMonth.subscribe((value) => {
			month = value !== null ? value : undefined;
			updateFlightData();
		});

		// Function to update flight data and draw the chart
		async function updateFlightData() {
			flightData = await getFlightsByDay(aircraft, month?.toString());
			planes = aircraft ? [aircraft] : await getAircrafts();

			if (!planes.length) {
				console.error('Planes array is empty. Cannot draw chart.');
				return;
			}

			drawChart();
		}
	});

	function drawChart() {
		// Clear existing SVG if any
		select('#flights-by-day-chart').selectAll('svg').remove();

		// Set up scales
		const x0 = scaleBand()
			.domain(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
			.rangeRound([0, width])
			.paddingInner(0.1);

		if (!planes.length) {
			console.error('Planes array is empty. Cannot draw chart.');
			return;
		}

		const x1 = scaleBand().domain(planes).rangeRound([0, x0.bandwidth()]).padding(0.05);

		const y = scaleLinear()
			.domain([0, max(flightData, (d) => parseFloat(d.total_flights.toString())) || 0])
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
		const groupedData = Array.from(d3.group(flightData, (d) => d.day_of_week.trim()))
			.filter(([day]) => x0(day) !== undefined)
			.filter(([day]) => x0(day) !== undefined);

		// Draw bars
		svg
			.selectAll('g.bar-group')
			.data(groupedData)
			.enter()
			.append('g')
			.attr('class', 'bar-group')
			.attr('transform', ([day]) => {
				const xPosition = x0(day);
				if (xPosition === undefined) {
					console.error(`Day '${day}' is not recognized in the x-axis domain.`);
				}
				return `translate(${xPosition ?? 0},0)`;
			})
			.selectAll('rect')
			.data(([, values]) => values)
			.enter()
			.append('rect')
			.attr('x', (d) => x1(d.aircraft) ?? 0)
			.attr('y', (d) => (isNaN(y(d.total_flights)) ? 0 : y(d.total_flights)))
			.attr('width', x1.bandwidth())
			.attr('height', (d) => (isNaN(y(d.total_flights)) ? 0 : height - y(d.total_flights)))
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
	<h2>Flights by Day of the Week</h2>
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
