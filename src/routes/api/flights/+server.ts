import { sql } from '@vercel/postgres';

type Flight = { pilot: string; aircraft: string; aircraft_hours: number };

export async function GET({ url }) {
	try {
		const aircraft = url.searchParams.get('aircraft');
		const month = url.searchParams.get('month');

		if (aircraft) {
			// Case when an aircraft is selected, optionally filter by month
			let query = `SELECT m.display_name AS pilot, f.aircraft, SUM(f.hours) AS aircraft_hours 
                   FROM flights f 
                   JOIN members m ON f.pilot = m.id 
                   WHERE f.aircraft = $1`;

			let params = [aircraft];

			if (month) {
				query += " AND TO_CHAR(f.depart_date, 'MM') = $2";
				params.push(month.padStart(2, '0')); // Ensure the month is two digits
			}

			query += ' GROUP BY m.display_name, f.aircraft ORDER BY aircraft_hours DESC';

			const { rows: flights } = await sql.query(query, params);

			const combinedResults = flights.reduce(
				(
					acc: {
						pilot: string;
						total_hours: number;
						aircrafts: { aircraft: string; aircraft_hours: number }[];
					}[],
					flight: Flight
				) => {
					// Check if pilot already exists in the results
					const existingPilot = acc.find((p) => p.pilot === flight.pilot);

					if (existingPilot) {
						// Add aircraft_hours to the total_hours and push this aircraft
						existingPilot.total_hours += flight.aircraft_hours;
						existingPilot.aircrafts.push({
							aircraft: flight.aircraft,
							aircraft_hours: flight.aircraft_hours
						});
					} else {
						// Add new pilot entry
						acc.push({
							pilot: flight.pilot,
							total_hours: flight.aircraft_hours,
							aircrafts: [{ aircraft: flight.aircraft, aircraft_hours: flight.aircraft_hours }]
						});
					}

					return acc;
				},
				[]
			);

			// Sort the combined results by total_hours in descending order
			combinedResults.sort((a, b) => b.total_hours - a.total_hours);

			return new Response(JSON.stringify(combinedResults), { status: 200 });
		}

		// Case when no specific aircraft is selected, optionally filter by month
		let query = `SELECT m.display_name AS pilot, f.aircraft, SUM(f.hours) AS aircraft_hours 
                 FROM flights f 
                 JOIN members m ON f.pilot = m.id`;

		let params: string[] = [];

		if (month) {
			query += " WHERE TO_CHAR(f.depart_date, 'MM') = $1";
			params.push(month.padStart(2, '0')); // Ensure the month is two digits
		}

		query += ' GROUP BY m.display_name, f.aircraft ORDER BY SUM(f.hours) DESC';

		const { rows: flights } = await sql.query(query, params);

		// Combine the results so that each pilot has multiple aircrafts (if applicable)
		const combinedResults = flights.reduce(
			(
				acc: {
					pilot: string;
					total_hours: number;
					aircrafts: { aircraft: string; aircraft_hours: number }[];
				}[],
				flight
			) => {
				const existingPilot = acc.find((p) => p.pilot === flight.pilot);

				if (existingPilot) {
					existingPilot.aircrafts.push({
						aircraft: flight.aircraft,
						aircraft_hours: flight.aircraft_hours
					});
					existingPilot.total_hours += flight.aircraft_hours;
				} else {
					acc.push({
						pilot: flight.pilot,
						total_hours: flight.aircraft_hours,
						aircrafts: [{ aircraft: flight.aircraft, aircraft_hours: flight.aircraft_hours }]
					});
				}

				return acc;
			},
			[]
		);

		// Sort the combined results by total_hours in descending order
		combinedResults.sort((a, b) => b.total_hours - a.total_hours);

		return new Response(JSON.stringify(combinedResults), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch flight hours' }), { status: 500 });
	}
}
