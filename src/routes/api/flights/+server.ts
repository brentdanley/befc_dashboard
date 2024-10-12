import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development.local' });

console.log('Postgres URL:', process.env.POSTGRES_URL);

export async function GET({ url }) {
	try {
		const aircraft = url.searchParams.get('aircraft');
		const month = url.searchParams.get('month');

		// Base query
		let baseQuery = `
            SELECT m.display_name AS pilot, f.aircraft, SUM(f.hours) AS aircraft_hours
            FROM flights f
            JOIN members m ON f.pilot = m.id
        `;

		let conditions = [];
		let params = [];

		if (aircraft) {
			conditions.push(`f.aircraft = $${params.length + 1}`);
			params.push(aircraft);
		}

		if (month) {
			conditions.push(`TO_CHAR(f.depart_date, 'MM') = $${params.length + 1}`);
			params.push(month.padStart(2, '0'));
		}

		if (conditions.length > 0) {
			baseQuery += ` WHERE ${conditions.join(' AND ')}`;
		}

		baseQuery += ` GROUP BY m.display_name, f.aircraft ORDER BY SUM(f.hours) DESC`;

		// Execute the query
		const { rows: flights } = await sql.query(baseQuery, params);

		// Process flights data
		const combinedResults = flights.reduce((acc, flight) => {
			const existingPilot = acc.find((p) => p.pilot === flight.pilot);

			if (existingPilot) {
				existingPilot.aircrafts.push({
					aircraft: flight.aircraft,
					aircraft_hours: parseFloat(flight.aircraft_hours)
				});
				existingPilot.total_hours =
					parseFloat(existingPilot.total_hours) + parseFloat(flight.aircraft_hours);
			} else {
				acc.push({
					pilot: flight.pilot,
					total_hours: parseFloat(flight.aircraft_hours),
					aircrafts: [
						{ aircraft: flight.aircraft, aircraft_hours: parseFloat(flight.aircraft_hours) }
					]
				});
			}

			return acc;
		}, []);

		combinedResults.sort((a, b) => b.total_hours - a.total_hours);

		return new Response(JSON.stringify(combinedResults), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch flight hours' }), { status: 500 });
	}
}
