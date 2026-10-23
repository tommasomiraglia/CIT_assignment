// Part A - arrays and types
//
// Fill in each TODO. Do not change the signatures: the parameter types and
// the return types are part of the task.
//
//     npm run build
//     npm start

import { Student, Enrolment, students, courses, enrolments } from './data.js';

// --- A1. The grade report -------------------------------------------------

/**
 * One line per enrolment of a student, in the order the enrolments appear:
 *
 *     CS-101 Intro. to Computer Science: 12
 *     BIO-301 Genetics: not awarded
 *
 * A grade of null is "not awarded". The lines are joined with a newline, and
 * a student with no enrolments gives an empty string.
 *
 * You need enrolments and courses. filter, map, find, a template literal and
 * join. No for loops in this file.
 */
export function gradeReport(studentId: string): string {
  return enrolments.filter(enrolment  => enrolment.studentId === studentId).map(enrolment => {
          const course = courses.find(course => enrolment.courseId === course.courseId)  
          if (!course) {
            return "";
          }
          const grade = enrolment.grade === null ? "not awarded" : enrolment.grade ;
          return `${course.courseId} ${course.title}: ${grade}`;
      }
      )
      .join("\n");
}

// --- A2. Averaging --------------------------------------------------------

/**
 * The average of a student's awarded grades, on the Danish 7-point scale
 * (12, 10, 7, 4, 02, 00, -3), rounded to one decimal.
 *
 * Grades are stored as strings, so '02' and '00' keep their leading zero.
 * Enrolments with no grade yet do not count. A student with no awarded
 * grades gives 0: divide only when there is something to divide by.
 *
 *     averageGrade('00128')   // 11  (12 and 10)
 */
export function averageGrade(studentId: string): number {
  const gradeFilter = enrolments.filter(enrolment => enrolment.studentId === studentId).filter(enrolment => enrolment.grade !== null)
  .map(enrolment => Number(enrolment.grade))
  if (gradeFilter.length !== 0) {
    const average = gradeFilter.reduce((sum, grade) => sum + grade, 0) / gradeFilter.length
    return Math.round(average * 10) / 10
  }
  return 0
}

// --- A3. Who is missing a grade ------------------------------------------

/**
 * The names of the students who have at least one enrolment without a grade,
 * sorted alphabetically and without repeats.
 */
export function awaitingGrades(): string[] {
 const namesWithDuplicates = enrolments
    .filter(enrolment => enrolment.grade === null)
    .map(enrolment => {
      const listStudent = students.find(student => student.id === enrolment.studentId);
      return listStudent?.name || "Unknown";
    });
  return Array.from(new Set(namesWithDuplicates)).sort();
}

// --- A4. A family of formatters ------------------------------------------

/**
 * Returns a function that formats a student in the chosen style:
 *
 *     formatterFor('short')(student)   // 'Zhang'
 *     formatterFor('long')(student)    // 'Zhang (Comp. Sci.), 102 credits'
 *
 * The style may only be one of two strings. Try passing 'medium' and read
 * the error the compiler gives you.
 */
export function formatterFor(style: 'short' | 'long'): (student: Student) => string {
  if (style === 'short') {
    return (student) => student.name;
  } else {
    return (student) => {
      return `${student.name} (${student.deptName}), ${student.totCred} credits`;
    };
  }
}

// --- A5. Changing nothing -------------------------------------------------

/**
 * A new array in which the students of one department have extra credits.
 * Everyone else is unchanged, and the students array itself must not change
 * at all: build new objects with the three dots.
 */
export function raiseCredits(list: Student[], deptName: string, extra: number): Student[] {
  const newList = list.map(student => {
    if (student.deptName === deptName) {
      return { ...student, totCred: student.totCred + extra }
    }
    return student
  });
  return newList;
}
