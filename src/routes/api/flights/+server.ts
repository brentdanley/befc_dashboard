import db from '$lib/db';

export async function GET({ url }) {
	try {
		// Get the 'aircraft' parameter from the query string
		const aircraft = url.searchParams.get('aircraft');

		// First query: Get total hours per pilot
		let query1 =
			'SELECT pilot, SUM(hours) AS total_hours FROM flights GROUP BY pilot ORDER BY total_hours DESC';

		// Execute the query to get total hours per pilot
		const pilots = db.prepare(query1).all() as { pilot: string; total_hours: number }[];

		// If we want the breakdown by aircraft too, we can use a second query
		let query2 =
			'SELECT pilot, aircraft, SUM(hours) AS aircraft_hours FROM flights GROUP BY pilot, aircraft';

		// Execute the query for aircraft breakdown
		const flights = db.prepare(query2).all() as {
			pilot: string;
			aircraft: string;
			aircraft_hours: number;
		}[];

		// Combine both results: We map each pilot's total hours with their respective aircraft breakdown
		const combinedResults = pilots.map((pilot) => ({
			...(typeof pilot === 'object' && pilot !== null ? pilot : {}),
			aircrafts: flights.filter((flight) => flight.pilot === pilot.pilot)
		}));

		return new Response(JSON.stringify(combinedResults), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error); // Log any errors
		return new Response(JSON.stringify({ error: 'Failed to fetch flights' }), { status: 500 });
	}
}
