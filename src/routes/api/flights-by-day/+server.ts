import { sql } from '@vercel/postgres';

export async function GET({ url }) {
	try {
		const aircraft = url.searchParams.get('aircraft');

		let query;
		if (aircraft) {
			// If an aircraft is specified, filter by it
			query = sql`
                SELECT aircraft, TO_CHAR(depart_date, 'Day') AS day_of_week, SUM(hours) AS total_hours 
                FROM flights 
                WHERE aircraft = ${aircraft}
                GROUP BY aircraft, day_of_week 
                ORDER BY day_of_week, aircraft`;
		} else {
			// Otherwise, return all aircraft
			query = sql`
                SELECT aircraft, TO_CHAR(depart_date, 'Day') AS day_of_week, SUM(hours) AS total_hours 
                FROM flights 
                GROUP BY aircraft, day_of_week 
                ORDER BY day_of_week, aircraft`;
		}

		const { rows: days } = await query;

		return new Response(JSON.stringify(days), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch flights by day of the week' }), {
			status: 500
		});
	}
}
