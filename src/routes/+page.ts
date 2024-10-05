// +page.ts
export const load = async ({ fetch }) => {
	const response = await fetch('/api/flights');
	const flights = await response.json();

	console.log('flights in +page.ts', flights);

	return { flights };
};
