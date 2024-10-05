// +page.ts
export const load = async ({ fetch, url }) => {
	const aircraft = url.searchParams.get('aircraft') || ''; // Retrieve aircraft filter from query params
	const res = await fetch(`/api/flights?aircraft=${aircraft}`);
	const flights = await res.json();

	return { flights };
};
