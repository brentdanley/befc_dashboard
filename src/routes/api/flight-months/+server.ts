// API returns array of months for which there are records in the flights table
import { sql } from '@vercel/postgres';

export async function GET() {
	try {
		const { rows: months } = await sql`
            SELECT DISTINCT TO_CHAR(depart_date, 'MM') AS month
            FROM flights
            ORDER BY month
        `;

		return new Response(JSON.stringify(months), { status: 200 });
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch months' }), { status: 500 });
	}
}
