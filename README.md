# CIT Assignments

Group assignments for Complex IT Systems – Theory E2026 (40417), Section 2:
backend development. Each assignment is a self-contained Node.js/TypeScript
project in its own directory, with its own `package.json`, `tsconfig.json`
and `.gitignore`.

| Directory | Topic |
| --- | --- |
| [`assignment_3/`](assignment_3/) | TypeScript: types, arrays, higher-order functions and closures |
| [`assignment_4/`](assignment_4/) | Database access: async code, PostgreSQL, queries, stored routines and transactions |

## assignment_3: TypeScript

Works on in-memory university data (students, enrolments and grades on the
Danish 7-point scale).

- **Part A, arrays and types** (`src/arrays.ts`): `gradeReport`,
  `averageGrade`, `awaitingGrades`, `formatterFor`, `raiseCredits`.
- **Part B, higher-order functions and closures** (`src/functions.ts`):
  `not`, `partition`, `once`, `allOf`.

The full task description is in
[`assignment-typescript-description.md`](assignment_3/assignment-typescript-description.md).

```
cd assignment_3
npm install
npm run build
npm start
```

## assignment_4: Database access

Talks to the `university` PostgreSQL database through `pg`. Grades are
stored on the American letter scale and converted with the `danish_grade`
database function. That function is not part of `university_database.sql`,
so [`danish_grade.sql`](assignment_4/danish_grade.sql) creates it if it is
missing. `npm start` runs this automatically before anything else (see
`src/setup.ts`).

- **Part A, queries** (`src/queries.ts`): listing, finding, inserting and
  deleting students, courses per student, students per department.
- **Part B, transactions and stored routines** (`src/transaction.ts`,
  `src/procedures.ts`, `procedures.sql`): enrolment as a TypeScript
  transaction and as the `enrol_student` procedure, plus the
  `student_transcript` function. Run `procedures.sql` in pgAdmin against the
  `university` database before `npm start`.
- **Part C, asynchronous code** (`src/async.ts`): sequential vs. parallel
  awaits and error handling.

Written answers are in [`ANSWERS.md`](assignment_4/ANSWERS.md), and the full
task description is in
[`assignment-database-description.md`](assignment_4/assignment-database-description.md).
The schema is in [`university_database.sql`](assignment_4/university_database.sql).

Requires a running PostgreSQL with the `university` database, with
`procedures.sql` run against it (`danish_grade` is handled for you). Copy
`.env.example` to `.env` and fill in your own credentials (`.env` is not
committed):

```
cd assignment_4
cp .env.example .env
npm install
npm run build
npm start
```

Expected output on a working connection: `connected`.
