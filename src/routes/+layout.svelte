<script lang="ts">
	let { children } = $props();
	let pageTitle = $state('BEFC Pilot Dashboard');
</script>

<header>
	<h1>{pageTitle}</h1>
</header>

<main>
	{@render children()}
</main>

<footer>
	<p>Brent Danley © {new Date().getFullYear()}</p>
</footer>

<style>
	header {
		background-color: #f8f9fa;
		padding: 1rem;
		text-align: center;
	}

	main {
		padding: 2rem;
	}

	footer {
		text-align: center;
		padding: 1rem;
		background-color: #e9ecef;
		margin-top: 2rem;
	}
</style>
