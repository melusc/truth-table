import test from 'ava';

import {Operator, OperatorSymbols} from '../src/operators.js';
import {operationToString} from '../src/operation-to-string.js';

test('a AND b', t => {
	t.is(
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

test('a AND (b XOR (c <=> d))', t => {
	t.is(
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
