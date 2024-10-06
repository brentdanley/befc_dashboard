<script lang="ts">
	import Flights from '$lib/components/Flights.svelte';
	import AircraftFilter from '$lib/components/AircraftFilter.svelte';
	import MonthFilter from '$lib/components/MonthFilter.svelte';
	import { selectedAircraft } from '$lib/stores';

	let aircraft = $state();

	$effect(() => {
		selectedAircraft.subscribe((value) => {
			aircraft = value;
		});
	});
</script>

<AircraftFilter />
<MonthFilter />
<Flights {aircraft} month={1} />
