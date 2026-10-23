// Part B2 and B3 - calling what you wrote in the database
//
// Write the routines in procedures.sql first, in pgAdmin. Calling them is an
// ordinary query: a FUNCTION goes inside a SELECT, a PROCEDURE uses CALL.

import { pool } from './db.js';

export interface TranscriptRow {
  courseId: string;
  title: string;
  grade: string | null;
}

/**
 * The transcript of a student, from the stored function:
 *
 *     SELECT * FROM student_transcript($1)
 *
 * The function raises an exception for an unknown student, which arrives
 * here as a rejected promise. Let it travel on: this one throws.
 */
export async function transcriptOf(studentId: string): Promise<TranscriptRow[]> {
  // The function's columns are course_id, title, grade; rename for TypeScript.
  const result = await pool.query<TranscriptRow>(
    `SELECT course_id AS "courseId", title, grade
       FROM student_transcript($1)`,
    [studentId]);
  return result.rows;
}

/**
 * The same, but undefined instead of an error when the student does not
 * exist.
 *
 * An exception you raised yourself arrives with err.code === 'P0001'. Any
 * other code is a real failure and must be re-thrown rather than swallowed:
 * a syntax error in your SQL is not "no such student".
 */
export async function transcriptOrUndefined(
  studentId: string): Promise<TranscriptRow[] | undefined> {
  try {
    // return await, not just return: without the await the rejection would
    // happen after we left the try block, and the catch would never see it.
    return await transcriptOf(studentId);
  } catch (err) {
    if ((err as { code?: string }).code === 'P0001') {
      return undefined;   // our own RAISE EXCEPTION: no such student
    }
    throw err;            // anything else is a real failure
  }
}

/**
 * Enrols a student by calling the stored procedure:
 *
 *     CALL enrol_student($1, $2, $3, $4, $5, NULL)
 *
 * The INOUT parameter comes back as a row. Note that tot_cred is numeric, so
 * the new total arrives as a string: convert it.
 *
 * Returns the new credit total.
 */
export async function enrolWithProcedure(
  studentId: string, courseId: string, secId: string,
  semester: string, year: number): Promise<number> {
  const result = await pool.query<{ new_total: string }>(
    'CALL enrol_student($1, $2, $3, $4, $5, NULL)',
    [studentId, courseId, secId, semester, year]);
  // numeric arrives as a string ('7'), so convert it.
  return Number(result.rows[0].new_total);
}
