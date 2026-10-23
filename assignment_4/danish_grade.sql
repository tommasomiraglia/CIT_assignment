-- danish_grade(letter): converts an American letter grade to the Danish
-- 7-point scale. Every query in this assignment that returns a grade calls it.
--
-- It comes from Task 5 of the database exercises, so it may already be in
-- your database. If it is not, this file creates it. You do not have to run
-- it yourself: npm start runs it first (see src/setup.ts). It can also be run
-- by hand in pgAdmin against the university database.
--
-- An existing danish_grade is left alone, so running this again, or against a
-- database that already has its own version, changes nothing.
--
-- The mapping matches the grades in Assignment 3, which uses the same
-- enrolments already on the Danish scale. D does not occur in the data; it
-- is mapped to 02, the lowest pass, the same as C-.
--
--     SELECT danish_grade('A'), danish_grade('C-'), danish_grade(NULL);
--     -- 12, 02, null

DO $do$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc
                  WHERE proname = 'danish_grade'
                    AND pg_function_is_visible(oid)) THEN
    CREATE FUNCTION danish_grade(letter varchar)
    RETURNS varchar
    LANGUAGE sql IMMUTABLE AS $fn$
      SELECT CASE letter
               WHEN 'A+' THEN '12'
               WHEN 'A'  THEN '12'
               WHEN 'A-' THEN '10'
               WHEN 'B+' THEN '10'
               WHEN 'B'  THEN '7'
               WHEN 'B-' THEN '7'
               WHEN 'C+' THEN '4'
               WHEN 'C'  THEN '4'
               WHEN 'C-' THEN '02'
               WHEN 'D+' THEN '02'
               WHEN 'D'  THEN '02'
               WHEN 'D-' THEN '02'
               WHEN 'F'  THEN '00'
               ELSE NULL   -- no grade awarded yet
             END;
    $fn$;
  END IF;
END
$do$;
