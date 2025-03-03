import assert from 'node:assert/strict';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import test from 'node:test';

import {operations} from '../src/eval.js';

const createTest = async <T extends keyof typeof operations>(
	title: T,
	valueResults: Array<[Parameters<(typeof operations)[T]>, boolean]>,
): Promise<void> =>
	test(title, () => {
		for (const row of valueResults) {
			assert.equal(
				// @ts-expect-error: row[0] is a tuple
				operations[title](...row[0]),
				row[1],
				`${title}(${row[0].join(', ')}) should equal ${String(row[1])}`,
			);
		}
	});
await createTest('iff', [
	[[true, true], true],
	[[true, false], false],
	[[false, true], false],
	[[false, false], true],
]);

await createTest('ifthen', [
	[[true, true], true],
	[[true, false], false],
	[[false, true], true],
	[[false, false], true],
]);

await createTest('not', [
	[[true], false],
	[[false], true],
]);

await createTest('and', [
	[[true, true], true],
	[[true, false], false],
	[[false, true], false],
	[[false, false], false],
]);

await createTest('xor', [
	[[true, true], false],
	[[true, false], true],
	[[false, true], true],
	[[false, false], false],
]);

await createTest('or', [
	[[true, true], true],
	[[true, false], true],
	[[false, true], true],
	[[false, false], false],
]);
