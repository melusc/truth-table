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

import {evalOperation} from '../src/eval.js';
import {Operator} from '../src/operators.js';
import {parseOperation} from '../src/parse-operation.js';

const t1 = `
(
	a && (b || c)
	xor
	(
		(d -> c) <-> e
	)
) && (!e || c) -> f`;
await test(t1, () => {
	const parsed = parseOperation(t1);
	assert.equal(
		evalOperation(parsed, {
			A: true,
			B: false,
			C: true,
			D: true,
			E: false,
			F: false,
		}),
		false,
	);

	assert.equal(
		evalOperation(parsed, {
			A: false,
			B: false,
			C: true,
			D: false,
			E: true,
			F: true,
		}),
		true,
	);
});

const t2 = 'a xnor b';
await test(t2, () => {
	const parsed = parseOperation(t2);

	assert.equal(evalOperation(parsed, {A: true, B: true}), true);
	assert.equal(evalOperation(parsed, {A: true, B: false}), false);
	assert.equal(evalOperation(parsed, {A: false, B: true}), false);
	assert.equal(evalOperation(parsed, {A: false, B: false}), true);
});

const t3 = 'a NAND b';
await test(t3, () => {
	const parsed = parseOperation(t3);

	assert.equal(evalOperation(parsed, {A: true, B: true}), false);
	assert.equal(evalOperation(parsed, {A: true, B: false}), true);
	assert.equal(evalOperation(parsed, {A: false, B: true}), true);
	assert.equal(evalOperation(parsed, {A: false, B: false}), true);
});

const t4 = 'a NOR b';
await test(t4, () => {
	const parsed = parseOperation(t4);

	assert.equal(evalOperation(parsed, {A: true, B: true}), false);
	assert.equal(evalOperation(parsed, {A: true, B: false}), false);
	assert.equal(evalOperation(parsed, {A: false, B: true}), false);
	assert.equal(evalOperation(parsed, {A: false, B: false}), true);
});

await test('Unexpected type', () => {
	assert.throws(() => {
		evalOperation(
			{
				type: 'abc' as 'operator',
				operator: Operator.and,
				values: [
					{
						type: 'variable',
						variable: 'A',
					},
					{
						type: 'variable',
						variable: 'B',
					},
				],
			},
			{
				A: true,
				B: true,
			},
		);
	}, Error);
});
