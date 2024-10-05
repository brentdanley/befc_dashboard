import Database from 'better-sqlite3';

const db = new Database('./database/befc_flights.db'); // Make sure the path is correct

export default db;
