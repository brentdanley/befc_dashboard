<script lang="ts">
	let pageTitle = $state('BEFC Pilot Dashboard');
</script>

<header>
	<h1>{pageTitle}</h1>
</header>

<main>
	<!-- The child content from your specific routes will be automatically inserted here -->
	<slot />
</main>

<footer>
	<p>Brent Danley © 2024</p>
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
