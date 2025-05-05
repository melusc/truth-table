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
