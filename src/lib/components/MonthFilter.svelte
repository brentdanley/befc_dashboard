<script lang="ts">
	import { selectedMonth } from '$lib/stores';
	import { months } from '$lib/constants';

	// Function to select the month
	function selectMonth(month: number | null) {
		selectedMonth.set(month); // Update the month in the store
	}
</script>

<div class="month-filter">
	{#each months as month}
		<button
			class={$selectedMonth === month.value ? 'selected' : ''}
			onclick={() => selectMonth(month.value)}
		>
			{month.name}
		</button>
	{/each}
	<button class={selectedMonth === null ? 'selected' : ''} onclick={() => selectMonth(null)}
		>All</button
	>
</div>

<style>
	.month-filter {
		margin: 2rem auto 1rem 0;
		button {
			margin-right: 10px;
			padding: 8px;
			cursor: pointer;
			transition: background-color 0.3s ease;
		}
	}
	.selected {
		background-color: #4caf50;
		color: white;
	}
</style>
