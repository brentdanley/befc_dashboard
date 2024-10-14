import { sql } from '@vercel/postgres';

export async function GET({ url }) {
	try {
		const aircraft = url.searchParams.get('aircraft');
		const month = parseInt(url.searchParams.get('month'));

		let query;
		if (aircraft && month) {
			// If an aircraft and month are specified, filter by both
			query = sql`
                SELECT aircraft, TO_CHAR(depart_date, 'FMDay') AS day_of_week, COUNT(*) AS total_flights 
                FROM flights 
                WHERE aircraft = ${aircraft} AND EXTRACT(MONTH FROM depart_date) = ${month}
                GROUP BY aircraft, day_of_week 
                ORDER BY day_of_week, aircraft`;
		} else if (month) {
			// If only a month is specified, filter by month
			query = sql`
                SELECT aircraft, TO_CHAR(depart_date, 'FMDay') AS day_of_week, COUNT(*) AS total_flights 
                FROM flights 
                WHERE EXTRACT(MONTH FROM depart_date) = ${month}
                GROUP BY aircraft, day_of_week 
                ORDER BY day_of_week, aircraft`;
		} else if (aircraft) {
			// If only an aircraft is specified, filter by aircraft
			query = sql`
                SELECT aircraft, TO_CHAR(depart_date, 'FMDay') AS day_of_week, COUNT(*) AS total_flights 
                FROM flights 
                WHERE aircraft = ${aircraft}
                GROUP BY aircraft, day_of_week 
                ORDER BY day_of_week, aircraft`;
		} else {
			// Otherwise, return all aircraft
			query = sql`
                SELECT aircraft, TO_CHAR(depart_date, 'FMDay') AS day_of_week, COUNT(*) AS total_flights 
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
