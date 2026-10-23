// Database setup that the runner needs before anything else.
//
// danish_grade comes from the database exercises, so a fresh copy of the
// university database does not have it. This runs danish_grade.sql, which
// creates the function only when it is missing.

import { readFile } from 'node:fs/promises';
import { pool } from './db.js';

export async function ensureDanishGrade(): Promise<void> {
  // From dist/setup.js, ../danish_grade.sql is the file in the project folder.
  const sql = await readFile(new URL('../danish_grade.sql', import.meta.url), 'utf8');
  await pool.query(sql);
}
