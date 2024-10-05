import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('database/befc_flights.db');

export default db;
