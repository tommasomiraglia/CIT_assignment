// Part B - higher-order functions and closures
//
// Each of these either takes a function, returns one, or both.
// --- B1. The opposite test ------------------------------------------------
/**
 * Takes a test and returns the opposite test:
 *
 *     const inCs = (s: Student) => s.deptName === 'Comp. Sci.';
 *     students.filter(not(inCs));      // everyone else
 *
 * One line is enough, once you see what has to be returned.
 */
export function not(test) {
    return (student) => !test(student);
}
// --- B2. One pass, two answers -------------------------------------------
/**
 * Splits a list in two by a test, in one pass: those that pass first, those
 * that fail second.
 *
 *     const [passing, failing] = partition(students, s => s.totCred >= 60);
 *
 * The return type is a tuple, so the two arrays cannot be mixed up, and the
 * caller can take them apart by position.
 */
export function partition(list, test) {
    let passed = [];
    let failed = [];
    list.forEach(student => {
        if (test(student)) {
            passed.push(student);
        }
        else {
            failed.push(student);
        }
    });
    return [passed, failed];
}
// --- B3. Do it once -------------------------------------------------------
/**
 * The parameter is a calculation: a function that takes no arguments and
 * returns a number. Takes such a function and returns a new one that runs
 * it the first time it is called and never again. Every later call hands
 * back the number from the first call, without calculating it again:
 *
 *     let calls = 0;
 *     const count = once(() => { calls++; return students.length; });
 *     count();   // 13, calls is now 1
 *     count();   // 13, calls is still 1
 *
 * Be ready to say where the saved number lives after once has returned.
 */
export function once(calculation) {
    let isFirst = true;
    let result;
    return () => {
        if (isFirst) {
            result = calculation();
            isFirst = false;
        }
        return result;
    };
}
// --- B4. All of them ------------------------------------------------------
/**
 * Combines any number of tests into one test that passes only when all of
 * them do:
 *
 *     const senior = allOf(inDepartment('Comp. Sci.'), atLeast(60));
 *
 * The three dots in a parameter list gather the arguments into an array.
 * With no tests at all, everything passes: there is nothing to fail.
 */
export function allOf(...tests) {
    let allTest = (student) => {
        let failed = false;
        tests.forEach(test => {
            if (!test(student)) {
                failed = true;
            }
        });
        return !failed;
    };
    return allTest;
}
// Two small helpers to build tests with, given to you.
export const inDepartment = (deptName) => (student) => student.deptName === deptName;
export const atLeast = (credits) => (student) => student.totCred >= credits;
//# sourceMappingURL=functions.js.map