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
	<button class:selected={aircraft === 'N8181N'} onclick={() => selectAircraft('N8181N')}
		>8181N</button
	>
	<button class:selected={aircraft === 'N4818D'} onclick={() => selectAircraft('N4818D')}
		>4818D</button
	>
	<button class:selected={aircraft === ''} onclick={() => selectAircraft('')}>Both</button>
</div>

<style>
	.select-aircraft {
		button {
			font-size: 1.2rem;
			padding: 0.6rem 1rem;
			background-color: white;
			border-radius: 0.7rem;
		}
		.selected {
			background-color: red;
			color: white;
		}
	}
</style>
