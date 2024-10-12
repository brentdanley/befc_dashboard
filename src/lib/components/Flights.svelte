<script lang="ts">
	import { selectedAircraft, selectedMonth } from '$lib/stores';
	import { months } from '$lib/constants';
	import { onMount } from 'svelte';

	type Aircraft = {
		aircraft: string;
		aircraft_hours: number;
	};

	type Flight = {
		pilot: string;
		total_hours: number;
		aircraft: Aircraft[];
	};

	let flights = $state<Flight[]>([]);
	let month = $state<number | null>(null);
	let aircraft = $state('');

	async function fetchFlights() {
		const query = new URLSearchParams({
			aircraft: (aircraft as string) || '',
			month: month?.toString() || ''
		}).toString();

		const res = await fetch(`/api/flights?${query}`);
		flights = await res.json();
	}

	onMount(() => {
		fetchFlights();
	});

	$effect(() => {
		selectedAircraft.subscribe((value) => {
			if (aircraft !== value) {
				aircraft = value;
				fetchFlights(); // Only fetch when aircraft changes
			}
		});

		selectedMonth.subscribe((value) => {
			if (month !== value) {
				month = value;
				fetchFlights(); // Only fetch when month changes
			}
		});
	});

	const aircraftColors: { [key: string]: string } = {
		N8181N: '#ff6347', // Red
		N4818D: '#1e90ff' // Blue
	};

	// Function to calculate the segment width for each aircraft
	function calculateSegmentWidth(
		aircraftHours: number,
		pilotTotalHours: number,
		maxWidth: number = 300
	) {
		const maxTotalHours = Math.max(
			...flights.map((f) =>
				flights
					.filter((flight) => flight.pilot === f.pilot)
					.reduce((sum, flight) => sum + flight.total_hours, 0)
			)
		);

		if (maxTotalHours === 0) {
			return 0; // Handle zero flights case
		}

		const totalBarWidth = (pilotTotalHours / maxTotalHours) * maxWidth;
		return (aircraftHours / pilotTotalHours) * totalBarWidth;
	}

	const getMonthName = (month: number) => months.find((m) => m.value === month)?.name;
</script>

<div class="flight-hours-wrapper">
	<h3 class="heading">
		Pilot Flight Hours{month !== null ? ' for ' + getMonthName(month) : ''}
	</h3>
	<table class="flight-hours-table">
		<thead>
			<tr class="header-row">
				<th>Pilot</th>
				<th>Hours</th>
			</tr>
		</thead>
		<tbody>
			{#each flights as pilot}
				{#if pilot.pilot}
					<tr>
						<td>{pilot.pilot}</td>
						<td>
							<div class="bar-container">
								{#each pilot.aircrafts as aircraft}
									<div
										class="bar"
										style="background-color: {aircraftColors[
											aircraft.aircraft
										]}; width: {calculateSegmentWidth(
											aircraft.aircraft_hours,
											pilot.total_hours
										)}px;"
									></div>
								{/each}
								<span class="hours-label">{pilot.total_hours.toFixed(1)}</span>
								<!-- Label moved here -->
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.flight-hours-wrapper {
		margin: 2rem;
		border: 2px solid black;
		padding: 2rem;
		display: inline-block;
	}

	.heading {
		text-align: center;
		margin: 0 0 2rem;
		font-size: 1.8rem;
	}
	.flight-hours-table {
		font-family: 'Courier New', Courier, monospace;
	}
	.header-row {
		font-size: 1.2rem;
	}
	.bar-container {
		display: flex;
		align-items: center;
		margin-left: 10px;
	}

	.bar {
		height: 10px;
		margin-right: 2px; /* Adjust spacing between segments */
	}

	.hours-label {
		margin-left: 10px;
	}
</style>
