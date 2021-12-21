import test from 'ava';

import {parseOperation} from '../src/parse-operation.js';
import {operationToString} from '../src/operation-to-string.js';
import {IndexedError} from '../src/indexed-error.js';

const t1 = '(a) && (b)';
test(t1, t => {
	t.deepEqual(parseOperation(t1), {
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
test(t2, t => {
	t.deepEqual(parseOperation(t2), {
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
test(t3, t => {
	t.deepEqual(parseOperation(t3), {
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
test(t4, t => {
	t.deepEqual(parseOperation(t4), {
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
test(t5, t => {
	t.deepEqual(parseOperation(t5), {
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
test(t6, t => {
	t.deepEqual(parseOperation(t6), {
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
test(t7, t => {
	t.deepEqual(parseOperation(t7), {
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
test(t8, t => {
	t.deepEqual(parseOperation(t8), {
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
test(`${t9} should deep equal itself when parsing it after restringified`, t => {
	const parsed1 = parseOperation(t9);
	const parsed2 = parseOperation(operationToString(parsed1));
	operationToString(parsed2); // For all cached stringifieds

	t.deepEqual(parsed2, parsed1);
});

const t10 = 'a b';
test(t10, t => {
	t.throws(
		() => {
			parseOperation(t10);
		},
		{
			message: 'Expected "a b" to have an operator.',
			instanceOf: IndexedError,
		},
	);
});

const t11 = '((a -> b) -> c) && ((c d -> a) XOR b)';
test(t11, t => {
	t.throws(
		() => {
			parseOperation(t11);
		},
		{
			message: 'Expected "c d" to have an operator.',
			instanceOf: IndexedError,
		},
	);
});
