import db from '$lib/db';

export async function GET() {
	try {
		const flights = db
			.prepare(
				'SELECT pilot, SUM(hours) AS total_hours FROM flights GROUP BY pilot ORDER BY total_hours DESC'
			)
			.all();
		return new Response(JSON.stringify(flights), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error); // Log any errors
		return new Response(JSON.stringify({ error: 'Failed to fetch flights' }), { status: 500 });
	}
}
