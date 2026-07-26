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

import {generateTable} from '../src/generate-table.js';
import {OperatorSymbols} from '../src/operators.js';

const t1 = 'a OR b';
await test(t1, () => {
	const {columns, rows} = generateTable(t1);
	assert.deepEqual(columns, ['A', 'B', `A ${OperatorSymbols.or} B`]);
	assert.deepEqual(rows, [
		[false, false, false],
		[false, true, true],
		[true, false, true],
		[true, true, true],
	]);
});

const t2 = '(a and b) and c';
await test(t2, () => {
	const {columns, rows} = generateTable(t2);
	assert.deepEqual(columns, [
		'A',
		'B',
		'C',
		`A ${OperatorSymbols.and} B`,
		`(A ${OperatorSymbols.and} B) ${OperatorSymbols.and} C`,
	]);
	assert.deepEqual(rows, [
		[false, false, false, false, false],
		[false, false, true, false, false],
		[false, true, false, false, false],
		[false, true, true, false, false],
		[true, false, false, false, false],
		[true, false, true, false, false],
		[true, true, false, true, false],
		[true, true, true, true, true],
	]);
});

const t3 = '(a and b) or (a and b)';
await test(t3, () => {
	const {columns, rows} = generateTable(t3);
	assert.deepEqual(columns, [
		'A',
		'B',
		`A ${OperatorSymbols.and} B`,
		`(A ${OperatorSymbols.and} B) ${OperatorSymbols.or} (A ${OperatorSymbols.and} B)`,
	]);
	assert.deepEqual(rows, [
		[false, false, false, false],
		[false, true, false, false],
		[true, false, false, false],
		[true, true, true, true],
	]);
});

await test('generateTable with includeSteps=false', () => {
	const {columns, rows} = generateTable('(a & b) | (a & b)', {
		includeSteps: false,
	});
	assert.deepEqual(columns, [
		'A',
		'B',
		`(A ${OperatorSymbols.and} B) ${OperatorSymbols.or} (A ${OperatorSymbols.and} B)`,
	]);
	assert.deepEqual(rows, [
		[false, false, false],
		[false, true, false],
		[true, false, false],
		[true, true, true],
	]);
});

await test('generateTable with sortVariables=false', () => {
	const {columns, rows} = generateTable('b & a', {sortVariables: false});

	assert.deepEqual(columns, ['B', 'A', `B ${OperatorSymbols.and} A`]);

	assert.deepEqual(rows, [
		[false, false, false],
		[false, true, false],
		[true, false, false],
		[true, true, true],
	]);
});

await test('generateTable with sortVariables=true', () => {
	const {columns, rows} = generateTable('b & a', {sortVariables: true});

	assert.deepEqual(columns, ['A', 'B', `B ${OperatorSymbols.and} A`]);

	assert.deepEqual(rows, [
		[false, false, false],
		[false, true, false],
		[true, false, false],
		[true, true, true],
	]);
});

await test('generateTable with includeSteps=false and no operations', () => {
	const {columns, rows} = generateTable('A', {includeSteps: false});
	assert.deepEqual(columns, ['A']);
	assert.deepEqual(rows, [[false], [true]]);
});
