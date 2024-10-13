// API returns array of months for which there are records in the flights table
import { sql } from '@vercel/postgres';

export async function GET() {
	try {
		const { rows: months } = await sql`
        SELECT aircraft, DATE_TRUNC('month', depart_date) AS month, SUM(hours) AS total_hours FROM flights GROUP BY aircraft, month ORDER BY month, aircraft`;

		return new Response(JSON.stringify(months), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch flights by months' }), {
			status: 500
		});
	}
}
