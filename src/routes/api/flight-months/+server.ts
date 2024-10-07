// API returns array of months for which their are records in the flights table
import db from '$lib/db';

export async function GET() {
	try {
		const months = db
			.prepare("SELECT DISTINCT strftime('%m', depart_date) AS month FROM flights ORDER BY month")
			.all();

		return new Response(JSON.stringify(months), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch months' }), { status: 500 });
	}
}
