import Database from 'better-sqlite3';
import dotenv from 'dotenv';

import setupExecution from './setup';

dotenv.config();

const DATABASE_PATH = './chronos.db';
const db = new Database(DATABASE_PATH, {});
const scripts = setupExecution();

for (const item of scripts) {
  // debug(`Executing ${item.name}...`);
  db.exec(item.script);
}

export default db;
