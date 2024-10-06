import db from '$lib/db';

export async function GET({ url }) {
	try {
		// Get the 'aircraft' parameter from the query string
		const aircraft = url.searchParams.get('aircraft');

		// Build the base query
		let query = 'SELECT pilot, SUM(hours) AS total_hours FROM flights';

		// Add WHERE clause only if aircraft is provided
		if (aircraft) {
			query += ' WHERE aircraft = ?';
		}

		// Group and order by pilot and total hours
		query += ' GROUP BY pilot ORDER BY total_hours DESC';

		// Prepare and execute the query
		const stmt = db.prepare(query);
		const flights = aircraft ? stmt.all(aircraft) : stmt.all(); // Execute with or without the aircraft parameter

		return new Response(JSON.stringify(flights), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error); // Log any errors
		return new Response(JSON.stringify({ error: 'Failed to fetch flights' }), { status: 500 });
	}
}
