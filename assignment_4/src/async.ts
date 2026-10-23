// Part C - asynchronous code against a real database

import { pool } from './db.js';
import { findStudent, coursesFor, deleteStudent } from './queries.js';

export interface Overview {
  students: number;
  courses: number;
  departments: number;
}

// --- C1. Steps that depend on each other ----------------------------------

/**
 * The title of the first course a student takes, or undefined when the
 * student does not exist or takes nothing.
 *
 * Two steps, the second needing the first. Handle a missing student with
 * try/catch or with a check, and say in a comment which you chose and why.
 */
export async function firstCourseTitle(studentId: string): Promise<string | undefined> {
  // A check, not try/catch. findStudent returns undefined for a missing
  // student instead of throwing, so there is nothing to catch: a missing
  // student is an ordinary answer. A try/catch here would also swallow real
  // failures, such as a lost connection, and report them as "no student".
  const student = await findStudent(studentId);
  if (student === undefined) {
    return undefined;
  }
  const courses = await coursesFor(studentId);   // needs the first step
  return courses[0]?.title;                      // undefined when it is []
}

// --- C2. Steps that do not depend on each other ---------------------------

/**
 * Three counts: students, courses, departments.
 *
 * Write it twice. overviewSlowly does one query after another; overview
 * starts all three together. The runner times both.
 *
 * Use this query, and note the pg_sleep: each count is made to take about
 * 200 ms on purpose.
 *
 *     SELECT pg_sleep(0.2), count(*)::int AS total FROM student
 *
 * Without it the three counts against a local database finish in about a
 * millisecond each, and starting them together costs more than it saves,
 * because the pool has to open two more connections. Waiting is what makes
 * the difference visible, and on a real server the waiting is real.
 */
// The three queries are fixed strings: a table name cannot be a $1 parameter.
const COUNT_STUDENTS = 'SELECT pg_sleep(0.2), count(*)::int AS total FROM student';
const COUNT_COURSES = 'SELECT pg_sleep(0.2), count(*)::int AS total FROM course';
const COUNT_DEPARTMENTS = 'SELECT pg_sleep(0.2), count(*)::int AS total FROM department';

async function count(sql: string): Promise<number> {
  const result = await pool.query<{ total: number }>(sql);
  return result.rows[0].total;
}

export async function overviewSlowly(): Promise<Overview> {
  // Each await waits for its count before the next one starts: 3 x 200 ms.
  const students = await count(COUNT_STUDENTS);
  const courses = await count(COUNT_COURSES);
  const departments = await count(COUNT_DEPARTMENTS);
  return { students, courses, departments };
}

export async function overview(): Promise<Overview> {
  // All three start at once, on three pool connections; Promise.all waits
  // for the slowest one: about 200 ms in total.
  const [students, courses, departments] = await Promise.all([
    count(COUNT_STUDENTS),
    count(COUNT_COURSES),
    count(COUNT_DEPARTMENTS),
  ]);
  return { students, courses, departments };
}

// --- C3. The forgotten await ----------------------------------------------

/**
 * Written for you, and wrong.
 *
 * It should delete a student and then report whether they are still there.
 * It reports that they are. Run it, explain in a comment what happens and
 * in which order, then write the corrected version below.
 *
 * There is a second problem, worse than the wrong answer: if the delete
 * fails, who finds out?
 *
 * What happens, in order:
 *   1. deleteStudent(id) is called. It sends the DELETE and immediately
 *      returns a promise. Nobody awaits it, so the function does not wait.
 *   2. findStudent(id) is called straight away. The pool gives it a second
 *      connection, so the SELECT runs at the same time as the DELETE.
 *   3. The SELECT reads the student before the DELETE has committed (until
 *      then, the row is still visible to every other connection), so it
 *      finds them and the function returns true.
 *   4. Some time later the DELETE finishes. Nothing is waiting for it.
 * Which of the two finishes first is a race; nothing in the code decides it.
 *
 * The worse problem: if the DELETE fails, its promise is rejected and nobody
 * is listening. The caller cannot catch it, because removeAndCheckBroken
 * has already returned its answer. The error becomes an "unhandled promise
 * rejection", which in Node crashes the whole process at some unrelated
 * later moment, or, if that is turned off, simply disappears.
 */
export async function removeAndCheckBroken(id: string): Promise<boolean> {
  deleteStudent(id);
  const still = await findStudent(id);
  return still !== undefined;
}

/** The same thing, correct: false when the student is really gone. */
export async function removeAndCheck(id: string): Promise<boolean> {
  // await the delete, so it has finished (and any error has been thrown to
  // our caller) before we look.
  await deleteStudent(id);
  const still = await findStudent(id);
  return still !== undefined;
}
