<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedMonth } from '$lib/stores';
	import { months } from '$lib/constants';

	let availableMonths: number[] = [];

	// Fetch available months when the component mounts
	onMount(async () => {
		const response = await fetch('/api/flight-months');
		const data = await response.json();
		availableMonths = data.map((item: { month: string }) => parseInt(item.month)); // Assuming 'month' is a string like '01', '02', etc.
		selectedMonth.set(null);
	});

	// Function to select the month
	function selectMonth(month: number | null) {
		selectedMonth.set(month); // Update the month in the store
	}
</script>

<div class="month-filter">
	{#each months as month, index}
		{#if availableMonths.includes(index + 1)}
			<button
				class={$selectedMonth === month.value ? 'selected' : ''}
				onclick={() => selectMonth(index + 1)}
			>
				{month.name}
			</button>
		{/if}
	{/each}
	<button class={$selectedMonth === null ? 'selected' : ''} onclick={() => selectMonth(null)}
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
