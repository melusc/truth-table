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

import {operationToString} from '../src/operation-to-string.js';
import {Operator, OperatorSymbols} from '../src/operators.js';

await test('a AND b', () => {
	assert.equal(
		operationToString({
			type: 'operator',
			operator: Operator.and,
			values: [
				{
					type: 'variable',
					variable: 'a',
				},
				{
					type: 'variable',
					variable: 'b',
				},
			],
		}),
		`(a ${OperatorSymbols.and} b)`,
	);
});

await test('a AND (b XOR (c <=> d))', () => {
	assert.equal(
		operationToString({
			type: 'operator',
			operator: Operator.and,
			values: [
				{
					type: 'variable',
					variable: 'a',
				},
				{
					type: 'operator',
					operator: Operator.xor,
					values: [
						{
							type: 'variable',
							variable: 'b',
						},
						{
							type: 'operator',
							operator: Operator.iff,
							values: [
								{
									type: 'variable',
									variable: 'c',
								},
								{
									type: 'variable',
									variable: 'd',
								},
							],
						},
					],
				},
			],
		}),
		`(a ${OperatorSymbols.and} (b ${OperatorSymbols.xor} (c ${OperatorSymbols.iff} d)))`,
	);
});
