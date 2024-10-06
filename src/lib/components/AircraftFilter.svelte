<!-- AircraftFilter.svelte -->
<script lang="ts">
	import { selectedAircraft } from '$lib/stores';
	let aircraft = $state('');

	// Function to update the selected aircraft
	function selectAircraft(ac: string) {
		selectedAircraft.set(ac);
	}

	selectedAircraft.subscribe((value) => {
		aircraft = value;
	});
</script>

<div class="select-aircraft">
	<button
		class:selected={aircraft === 'N8181N'}
		class="button-n8181n"
		onclick={() => selectAircraft('N8181N')}>8181N</button
	>
	<button
		class:selected={aircraft === 'N4818D'}
		class="button-n4818d"
		onclick={() => selectAircraft('N4818D')}>4818D</button
	>
	<button class:selected={aircraft === ''} class="button-all" onclick={() => selectAircraft('')}
		>Both</button
	>
</div>

<style>
	.select-aircraft {
		button {
			border: 2px solid black;
			border-radius: 4px;
			padding: 10px 20px;
			font-size: 1.2rem;
			font-family: 'Courier New', Courier, monospace;
			font-weight: bold;
			margin-right: 10px;
			cursor: pointer;
			transition: all 0.3s ease;
		}

		/* Default button hover effect */
		button:hover {
			box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
			transform: translateY(-2px);
		}

		.button-all {
			background-color: white;
		}
		.button-n4818d {
			background-color: #1e90ff;
			color: white;
		}

		.button-n8181n {
			background-color: #ff6347;
			color: white;
		}
		.selected {
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
		}
	}
</style>
