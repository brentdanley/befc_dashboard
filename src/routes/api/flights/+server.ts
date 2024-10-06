import db from '$lib/db';

export async function GET({ url }) {
	try {
		// Get the 'aircraft' parameter from the query string
		const aircraft = url.searchParams.get('aircraft');
		const month = url.searchParams.get('month');

		if (month) {
			console.log('month: ', month);
		}
		let query =
			'SELECT m.display_name AS pilot, f.aircraft, SUM(f.hours) AS aircraft_hours FROM flights f JOIN members m ON f.pilot = m.id WHERE f.aircraft = ?  GROUP BY m.display_name, f.aircraft ORDER BY aircraft_hours DESC';

		if (aircraft) {
			const flights = db.prepare(query).all(aircraft) as {
				pilot: string;
				aircraft: string;
				aircraft_hours: number;
			}[];

			// Convert this into the combined format expected
			const combinedResults = flights.map((flight) => ({
				pilot: flight.pilot,
				total_hours: flight.aircraft_hours, // total hours for this aircraft
				aircrafts: [{ aircraft: flight.aircraft, aircraft_hours: flight.aircraft_hours }] // single aircraft in an array
			}));

			return new Response(JSON.stringify(combinedResults), { status: 200 });
		}

		// First query: Get total hours per pilot
		let query1 =
			'SELECT m.display_name AS pilot, SUM(f.hours) AS total_hours FROM flights f LEFT JOIN members m ON m.id = f.pilot GROUP BY f.pilot ORDER BY total_hours DESC';

		// Execute the query to get total hours per pilot
		const pilots = db.prepare(query1).all() as { pilot: string; total_hours: number }[];

		// If we want the breakdown by aircraft too, we can use a second query
		let query2 =
			'SELECT m.display_name AS pilot, f.aircraft, SUM(f.hours) AS aircraft_hours FROM flights f JOIN members m ON f.pilot = m.id GROUP BY pilot, aircraft';

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
