<script lang="ts">
	import Flights from '$lib/components/Flights.svelte';
	import AircraftFilter from '$lib/components/AircraftFilter.svelte';
	import MonthFilter from '$lib/components/MonthFilter.svelte';
	import FlightsByMonth from '$lib/components/FlightsByMonth.svelte';
	import FlightsByDay from '$lib/components/FlightsByDay.svelte';
	import { selectedAircraft } from '$lib/stores';

	let aircraft = $state('');

	$effect(() => {
		selectedAircraft.subscribe((value) => {
			aircraft = value;
		});
	});
</script>

<div class="filter-wrapper">
	<AircraftFilter />
	<MonthFilter />
</div>
<div class="widgets-wrapper">
	<Flights />
	<FlightsByMonth />
	<FlightsByDay />
</div>

<style>
	.widgets-wrapper {
		display: flex;
		gap: 1rem;
	}
</style>
