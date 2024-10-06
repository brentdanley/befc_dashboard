<script lang="ts">
	import { selectedMonth } from '$lib/stores';

	// Months array
	const months = [
		{ value: 1, name: 'January' },
		{ value: 2, name: 'February' },
		{ value: 3, name: 'March' },
		{ value: 4, name: 'April' },
		{ value: 5, name: 'May' },
		{ value: 6, name: 'June' },
		{ value: 7, name: 'July' },
		{ value: 8, name: 'August' },
		{ value: 9, name: 'September' },
		{ value: 10, name: 'October' },
		{ value: 11, name: 'November' },
		{ value: 12, name: 'December' }
	];

	// Function to select the month
	function selectMonth(month: number) {
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
</div>

<style>
	.month-filter button {
		margin-right: 10px;
		padding: 8px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.selected {
		background-color: #4caf50;
		color: white;
	}
</style>
