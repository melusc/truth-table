import assert from 'node:assert/strict';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import test from 'node:test';

import {operationToString} from '../src/operation-to-string.js';
import {parseOperation} from '../src/parse-operation.js';

const t1 = '(a) && (b)';
await test(t1, () => {
	assert.deepEqual(parseOperation(t1), {
		type: 'operator',
		operator: 'and',
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
	});
});

const t2 = '!A';
await test(t2, () => {
	assert.deepEqual(parseOperation(t2), {
		type: 'operator',
		operator: 'not',
		values: [
			{
				type: 'variable',
				variable: 'A',
			},
		],
	});
});

const t3 = 'not A and not B';
await test(t3, () => {
	assert.deepEqual(parseOperation(t3), {
		type: 'operator',
		operator: 'and',
		values: [
			{
				type: 'operator',
				operator: 'not',
				values: [
					{
						type: 'variable',
						variable: 'A',
					},
				],
			},
			{
				type: 'operator',
				operator: 'not',
				values: [
					{
						type: 'variable',
						variable: 'B',
					},
				],
			},
		],
	});
});

const t4 = 'a and b xor c';
await test(t4, () => {
	assert.deepEqual(parseOperation(t4), {
		type: 'operator',
		operator: 'xor',
		values: [
			{
				type: 'operator',
				operator: 'and',
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
				type: 'variable',
				variable: 'C',
			},
		],
	});
});

const t5 = '(a and b) or (c xor not d)';
await test(t5, () => {
	assert.deepEqual(parseOperation(t5), {
		type: 'operator',
		operator: 'or',
		values: [
			{
				type: 'operator',
				operator: 'and',
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
				type: 'operator',
				operator: 'xor',
				values: [
					{
						type: 'variable',
						variable: 'C',
					},
					{
						type: 'operator',
						operator: 'not',
						values: [
							{
								type: 'variable',
								variable: 'D',
							},
						],
					},
				],
			},
		],
	});
});

const t6 = '(((a)))';
await test(t6, () => {
	assert.deepEqual(parseOperation(t6), {
		type: 'variable',
		variable: 'A',
	});
});

const t7 = `
	(
		a && (b || c)
		xor
		(
			(d -> c) <-> e
		)
	) && (e || c) -> f`;
await test(t7, () => {
	assert.deepEqual(parseOperation(t7), {
		type: 'operator',
		operator: 'ifthen',
		values: [
			{
				type: 'operator',
				operator: 'and',
				values: [
					{
						type: 'operator',
						operator: 'xor',
						values: [
							{
								type: 'operator',
								operator: 'and',
								values: [
									{
										type: 'variable',
										variable: 'A',
									},
									{
										type: 'operator',
										operator: 'or',
										values: [
											{
												type: 'variable',
												variable: 'B',
											},
											{
												type: 'variable',
												variable: 'C',
											},
										],
									},
								],
							},
							{
								type: 'operator',
								operator: 'iff',
								values: [
									{
										type: 'operator',
										operator: 'ifthen',
										values: [
											{
												type: 'variable',
												variable: 'D',
											},
											{
												type: 'variable',
												variable: 'C',
											},
										],
									},
									{
										type: 'variable',
										variable: 'E',
									},
								],
							},
						],
					},
					{
						type: 'operator',
						operator: 'or',
						values: [
							{
								type: 'variable',
								variable: 'E',
							},
							{
								type: 'variable',
								variable: 'C',
							},
						],
					},
				],
			},
			{
				type: 'variable',
				variable: 'F',
			},
		],
	});
});

const t8 = 'not not not not not A';
await test(t8, () => {
	assert.deepEqual(parseOperation(t8), {
		type: 'operator',
		operator: 'not',
		values: [
			{
				type: 'operator',
				operator: 'not',
				values: [
					{
						type: 'operator',
						operator: 'not',
						values: [
							{
								type: 'operator',
								operator: 'not',
								values: [
									{
										type: 'operator',
										operator: 'not',
										values: [
											{
												type: 'variable',
												variable: 'A',
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	});
});

const t9 = `
	(
		a -> not b
	) && (
		not not a -> b -> not c
	) && c || not d
`;
await test(`${t9} should deep equal itself when parsing it after restringified`, () => {
	const parsed1 = parseOperation(t9);
	const parsed2 = parseOperation(operationToString(parsed1));
	operationToString(parsed2); // For all cached stringifieds

	assert.deepEqual(parsed2, parsed1);
});

const t10 = 'a b';
await test(t10, () => {
	assert.throws(
		() => {
			parseOperation(t10);
		},
		{
			message: 'Expected "a b" to have an operator.',
			from: 0,
			to: 3,
			name: 'IndexedError',
		},
	);
});

const t11 = '((a -> b) -> c) && ((c d -> a) XOR b)';
await test(t11, () => {
	assert.throws(
		() => {
			parseOperation(t11);
		},
		{
			message: 'Expected operator, got type "variable" with value "c"',
			from: 21,
			to: 22,
			name: 'IndexedError',
		},
	);
});

await test('Empty input', () => {
	assert.throws(() => {
		parseOperation('');
	});
});

await test('Plain operator', () => {
	assert.throws(() => {
		parseOperation('&');
	});
});
