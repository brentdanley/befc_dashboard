<script lang="ts">
	let { aircraft } = $props();

	type Flight = {
		pilot: string;
		total_hours: number;
	};

	let flights = $state<Flight[]>([]);

	aircraft = aircraft || '';
	async function fetchFlights() {
		const query = new URLSearchParams({
			aircraft: aircraft as string
		}).toString();

		const res = await fetch(`/api/flights?${query}`);
		flights = await res.json();
	}

	$effect(() => {
		console.log($inspect(flights));
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
