import { sql } from '@vercel/postgres';

export async function GET({ url }) {
	try {
		const aircraft = url.searchParams.get('aircraft');
		let query;

		if (aircraft) {
			// If an aircraft is specified, filter by it
			query = sql`SELECT DISTINCT aircraft FROM flights WHERE aircraft = ${aircraft} ORDER BY aircraft;`;
		} else {
			// Otherwise, return all aircraft
			query = sql`SELECT DISTINCT aircraft FROM flights ORDER BY aircraft;`;
		}

		const { rows: aircrafts } = await query;

		// Map the results to return an array of aircraft strings
		const aircraftList = aircrafts.map((row) => row.aircraft);

		return new Response(JSON.stringify(aircraftList), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch aircrafts' }), { status: 500 });
	}
}
