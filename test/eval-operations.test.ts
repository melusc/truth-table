import test from 'ava';

import {operations} from '../src/eval.js';

const createTest = <T extends keyof typeof operations>(
	title: T,
	valueResults: Array<[Parameters<(typeof operations)[T]>, boolean]>,
): void => {
	test(title, t => {
		for (const row of valueResults) {
			t.is(
				// @ts-expect-error: row[0] is a tuple
				operations[title](...row[0]),
				row[1],
				`${title}(${row[0].join(', ')}) should equal ${String(row[1])}`,
			);
		}
	});
};

createTest('iff', [
	[[true, true], true],
	[[true, false], false],
	[[false, true], false],
	[[false, false], true],
]);

createTest('ifthen', [
	[[true, true], true],
	[[true, false], false],
	[[false, true], true],
	[[false, false], true],
]);

createTest('not', [
	[[true], false],
	[[false], true],
]);

createTest('and', [
	[[true, true], true],
	[[true, false], false],
	[[false, true], false],
	[[false, false], false],
]);

createTest('xor', [
	[[true, true], false],
	[[true, false], true],
	[[false, true], true],
	[[false, false], false],
]);

createTest('or', [
	[[true, true], true],
	[[true, false], true],
	[[false, true], true],
	[[false, false], false],
]);
