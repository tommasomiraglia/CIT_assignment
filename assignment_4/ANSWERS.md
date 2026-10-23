# Answers

## B3: the same enrolment written twice

**TypeScript (B1, `enrolInTypeScript`).** The logic sits next to the rest of
the application code. It is in the same language, version-controlled with the
app, type-checked, easy to debug with breakpoints, and easy to unit test. It is
also deployed with an ordinary release. What it costs: the transaction has to
be managed by hand (take a client, `BEGIN`, `COMMIT`, `ROLLBACK`, `release`),
every statement is a separate round trip to the database, and the rule only
protects data written through *this* application. Another program, or someone
in pgAdmin, can still insert a `takes` row without adding the credits.

**Stored procedure (B3, `enrol_student`).** The whole operation is one `CALL`:
one round trip, and it runs inside the database, so it is atomic without any
client code. Every client of the database (other services, scripts, pgAdmin)
gets the same rule. What it costs: the logic is now split across two
languages and two places. plpgsql is harder to test, debug and review. The
procedure has to be deployed separately with migrations, which means the
database schema and the application can drift out of step. A reader of the
TypeScript cannot see what `CALL enrol_student` really does.

**Where we would put it.** In a system we had to maintain, we would keep the
business rule ("enrolling adds the course credits") in TypeScript, as this
course does. That keeps all the logic in one place that the whole team can
read, test and change. The database keeps what it is best at enforcing:
constraints, foreign keys and transactions. The price of that choice is that
the rule is only as safe as the discipline of going through the application.
We would move a rule into the database only when several independent systems
write the same tables, or when the round trips really become a performance
problem.
