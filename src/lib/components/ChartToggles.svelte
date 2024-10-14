<script lang="ts">
	import { showCharts } from '$lib/stores';

	let charts = $state();

	showCharts.subscribe((value) => {
		charts = value;
	});

	const handleClick = (component: string) => {
		// Update the showCharts store
		showCharts.update((charts) => ({
			...charts,
			[component]: !charts[component]
		}));
	};
</script>

<div class="buttons-wrapper">
	<button onclick={() => handleClick('flight-hours')} class:selected={charts['flight-hours']}>
		Pilot Flight Hours
	</button>
	<button
		onclick={() => handleClick('flights-by-month')}
		class:selected={charts['flights-by-month']}
	>
		Flights by Month
	</button>
	<button onclick={() => handleClick('flights-by-day')} class:selected={charts['flights-by-day']}>
		Flights by Day
	</button>
</div>

<style>
	.buttons-wrapper {
		padding: 0;
		display: flex;
		gap: 10px;
	}
	button {
		padding: 5px 10px;
		border-radius: 3px;
		background-color: rgb(13, 126, 163);
		color: white;

		&.selected {
			background-color: red;
		}
	}
</style>
