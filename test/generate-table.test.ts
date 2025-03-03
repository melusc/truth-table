import assert from 'node:assert/strict';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import test from 'node:test';

import {generateTable} from '../src/generate-table.js';
import {OperatorSymbols} from '../src/operators.js';

const t1 = 'a OR b';
await test(t1, () => {
	const {columns, rows} = generateTable(t1);
	assert.deepEqual(columns, ['A', 'B', `A ${OperatorSymbols.or} B`]);
	assert.deepEqual(rows, [
		[true, true, true],
		[true, false, true],
		[false, true, true],
		[false, false, false],
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
		[true, true, true, true, true],
		[true, true, false, true, false],
		[true, false, true, false, false],
		[true, false, false, false, false],
		[false, true, true, false, false],
		[false, true, false, false, false],
		[false, false, true, false, false],
		[false, false, false, false, false],
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
		[true, true, true, true],
		[true, false, false, false],
		[false, true, false, false],
		[false, false, false, false],
	]);
});

await test('generateTable with includeSteps=false', () => {
	const {columns, rows} = generateTable('(a & b) | (a & b)', false);
	assert.deepEqual(columns, [
		'A',
		'B',
		`(A ${OperatorSymbols.and} B) ${OperatorSymbols.or} (A ${OperatorSymbols.and} B)`,
	]);
	assert.deepEqual(rows, [
		[true, true, true],
		[true, false, false],
		[false, true, false],
		[false, false, false],
	]);
});

await test('generateTable with includeSteps=false and no operations', () => {
	const {columns, rows} = generateTable('A', false);
	assert.deepEqual(columns, ['A']);
	assert.deepEqual(rows, [[true], [false]]);
});
