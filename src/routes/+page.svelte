<script lang="ts">
	let props = $props();
	let { flights } = $state(props.data || []);
</script>

<ul>
	{#each flights as flight}
		<li>{flight.pilot}: {flight.tail_number} - {flight.total_hours.toFixed(1)}</li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none; /* Removes the bullet points */
		padding-left: 0; /* Removes left padding (which can cause indent) */
		margin-left: 0; /* Removes left margin */
	}

	li {
		background-color: rgb(15, 54, 113);
		color: white;
		padding: 0.5rem 1rem;
		width: fit-content;
		margin: 0.1rem;
		border-radius: 3rem;
	}
</style>
