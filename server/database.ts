import Database from 'better-sqlite3';

const DATABASE_PATH = './chronos.db';
const db = new Database(DATABASE_PATH, {});

export default db;
