/*!
 * This file is part of @lusc/truth-table, a logic parser and table generator.
 * Copyright (C) 2026, Luca Schnellmann <oss@lusc.ch>

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import assert from 'node:assert/strict';
import test from 'node:test';

import {operations} from '../src/eval.js';

const createTest = async <T extends keyof typeof operations>(
	title: T,
	valueResults: Array<[Parameters<(typeof operations)[T]>, boolean]>,
): Promise<void> =>
	test(title, () => {
		for (const row of valueResults) {
			// eslint-disable-next-line node-test/no-conditional-assertion
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
