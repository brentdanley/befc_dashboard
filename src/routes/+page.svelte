<script lang="ts">
	import Flights from '$lib/components/Flights.svelte';
	import AircraftFilter from '$lib/components/AircraftFilter.svelte';
	import MonthFilter from '$lib/components/MonthFilter.svelte';
	import FlightsByMonth from '$lib/components/FlightsByMonth.svelte';
	import FlightsByDay from '$lib/components/FlightsByDay.svelte';
	import ChartToggles from '$lib/components/ChartToggles.svelte';
	import { selectedAircraft, showCharts } from '$lib/stores';
	import { onDestroy } from 'svelte';

	let aircraft = $state('');
	let charts = $state({});

	selectedAircraft.subscribe((value) => {
		aircraft = value;
	});

	showCharts.subscribe((value) => {
		charts = value;
	});

	/**
	 * I want to have buttons to select charts. If the chart isn't selected, show the chart and set the store value for the chart to true. If the value is true, hide the chart and set value to false.
	 */
</script>

<div class="page-container">
	<div class="filter-wrapper">
		<ChartToggles />
		<AircraftFilter />
		<MonthFilter />
	</div>
	<div class="widgets-wrapper">
		{#if charts['flight-hours']}
			<Flights />
		{/if}
		{#if charts['flights-by-month']}
			<FlightsByMonth />
		{/if}
		{#if charts['flights-by-day']}
			<FlightsByDay />
		{/if}
	</div>
</div>

<style>
	.page-container {
		max-width: 1200px;
		width: 100%;
	}

	.filter-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	.widgets-wrapper {
		display: flex;
		gap: 1rem;
	}
</style>
