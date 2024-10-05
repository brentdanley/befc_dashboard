<script lang="ts">
	import { selectedAircraft } from '$lib/stores';
	import { onMount } from 'svelte';
	let props = $props();
	console.log(props.data);
	let flights = $state(props.data);
	let aircraft = $state('');

	async function fetchFlights() {
		const response = await fetch(`/api/flights?aircraft=${aircraft}`);
		flights = await response.json();
	}

	onMount(() => {
		console.log('onMount, aircraft:', aircraft);

		if (aircraft !== undefined) {
			fetchFlights(); // Initial fetch when component mounts
		}
	});

	selectedAircraft.subscribe((value) => {
		aircraft = value;
		fetchFlights();
	});
</script>

<div class="flight-hours-wrapper">
	<table class="flight-hours-table">
		<thead>
			<tr class="header-row">
				<th>Pilot</th>
				<th>Hours</th>
			</tr>
		</thead>
		<tbody>
			{#each flights as flight}
				{#if flight.pilot}
					<tr class="pilot-row">
						<td>{flight.pilot}</td>
						<td>{flight.total_hours.toFixed(1)}</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.flight-hours-wrapper {
		margin: 2rem;
	}
	.flight-hours-table {
		font-family: 'Courier New', Courier, monospace;
	}
	.header-row {
		font-family: 1.2rem;
	}
	.pilot-row {
		padding: 0.5rem 1rem;
		width: fit-content;
		margin: 0.1rem;
		border-radius: 3rem;
	}
</style>
