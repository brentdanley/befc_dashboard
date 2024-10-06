<script lang="ts">
	import Flights from '$lib/components/Flights.svelte';
	import AircraftFilter from '$lib/components/AircraftFilter.svelte';
	import { selectedAircraft } from '$lib/stores';

	let aircraft = $state();

	$effect(() => {
		selectedAircraft.subscribe((value) => {
			aircraft = value;
		});
	});
</script>

<h1>BEFC Pilot Dashboard</h1>

<AircraftFilter />
<Flights {aircraft} />
