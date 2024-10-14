import { sql } from '@vercel/postgres';

export async function GET({ url }) {
	try {
		const aircraft = url.searchParams.get('aircraft');

		let query;
		if (aircraft) {
			// If an aircraft is specified, filter by it
			query = sql`
                SELECT aircraft, DATE_TRUNC('month', depart_date) AS month, COUNT(*) as total_flights
                FROM flights 
                WHERE aircraft = ${aircraft}
                GROUP BY aircraft, month 
                ORDER BY month, aircraft`;
		} else {
			// Otherwise, return all aircraft
			query = sql`
                SELECT aircraft, DATE_TRUNC('month', depart_date) AS month, COUNT(*) as total_flights
                FROM flights 
                GROUP BY aircraft, month 
                ORDER BY month, aircraft`;
		}

		const { rows: months } = await query;

		return new Response(JSON.stringify(months), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch flights by months' }), {
			status: 500
		});
	}
}
