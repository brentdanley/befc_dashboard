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
		fetchFlights();
	});

	// Function to calculate the bar width for each pilot
	const calculateWidth = (hours: number) => {
		// Find min and max hours
		const maxHours = Math.max(...flights.map((flight) => flight.total_hours));
		const minHours = Math.min(...flights.map((flight) => flight.total_hours));
		return ((hours - minHours) / (maxHours - minHours)) * (300 - 5) + 5;
	};
</script>

<div class="flight-hours-wrapper">
	<table class="flight-hours-table">
		<thead>
			<tr class="header-row">
				<th>Pilot</th>
				<th>Bar</th>
			</tr>
		</thead>
		<tbody>
			{#each flights as flight}
				{#if flight.pilot}
					<tr class="pilot-row">
						<td>{flight.pilot}</td>
						<td
							><div class="bar-container">
								<div
									class="bar"
									style="background-color: #4caf50; height: 10px; width: {calculateWidth(
										flight.total_hours
									)}px;"
								></div>
								<span class="hours-label">{flight.total_hours.toFixed(1)}</span>
							</div></td
						>
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
	.bar-container {
		display: flex;
		align-items: center;
	}

	.bar {
		margin-right: 10px; /* Space between the bar and the hours */
	}

	.hours-label {
		font-size: 0.9rem;
		white-space: nowrap; /* Prevents breaking into multiple lines */
	}
</style>
