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

import {generateBoolPermutations} from '../src/generate-bool-permutations.js';

await test('[a]', () => {
	assert.deepEqual(
		[...generateBoolPermutations(new Set(['a']))],
		[{a: false}, {a: true}],
	);
});

await test('[a, b]', () => {
	assert.deepEqual(
		[...generateBoolPermutations(new Set(['a', 'b']))],
		[
			{a: false, b: false},
			{a: false, b: true},
			{a: true, b: false},
			{a: true, b: true},
		],
	);
});

await test('[a, b, c]', () => {
	assert.deepEqual(
		[...generateBoolPermutations(new Set(['a', 'b', 'c']))],
		[
			{a: false, b: false, c: false},
			{a: false, b: false, c: true},
			{a: false, b: true, c: false},
			{a: false, b: true, c: true},
			{a: true, b: false, c: false},
			{a: true, b: false, c: true},
			{a: true, b: true, c: false},
			{a: true, b: true, c: true},
		],
	);
});
