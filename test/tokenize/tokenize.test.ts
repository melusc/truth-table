import test from 'ava';

import {OperatorSymbols, Operator} from '../../src/operators.js';
import {TokenType, tokenize, type Token} from '../../src/tokenize.js';

test('tokenize', t => {
	t.deepEqual<Token[], Token[]>(
		tokenize('!=='),
		[
			{
				type: TokenType.operator,
				operator: Operator.xor,
				from: 0,
				to: 3,
				source: '!==',
			},
		],
		'!==',
	);

	t.deepEqual<Token[], Token[]>(
		tokenize('abcd'),
		[
			{
				characters: 'ABCD',
				type: TokenType.variable,
				from: 0,
				to: 4,
				source: 'abcd',
			},
		],
		'abcd',
	);

	const brackets1 = ')((()())))';
	// Doesn't validate brackets
	t.deepEqual<Token[], Token[]>(
		tokenize(brackets1),
		[...brackets1].map((c, i) => ({
			type: TokenType.bracket,
			bracketType: c === ')' ? 'close' : 'open',
			from: i,
			to: i + 1,
			source: brackets1,
		})),
		brackets1,
	);

	const input1 = '(A)&(B)';
	t.deepEqual<Token[], Token[]>(
		tokenize(input1),
		[
			{
				type: TokenType.bracket,
				bracketType: 'open',
				from: 0,
				to: 1,
				source: input1,
			},
			{
				characters: 'A',
				type: TokenType.variable,
				from: 1,
				to: 2,
				source: input1,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
				from: 2,
				to: 3,
				source: input1,
			},
			{
				type: TokenType.operator,
				operator: Operator.and,
				from: 3,
				to: 4,
				source: input1,
			},
			{
				type: TokenType.bracket,
				bracketType: 'open',
				from: 4,
				to: 5,
				source: input1,
			},
			{
				characters: 'B',
				type: TokenType.variable,
				from: 5,
				to: 6,
				source: input1,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
				from: 6,
				to: 7,
				source: input1,
			},
		],
		input1,
	);

	const input2 = 'a AND b';
	t.deepEqual<Token[], Token[]>(
		tokenize(input2),
		[
			{
				characters: 'A',
				type: TokenType.variable,
				from: 0,
				to: 1,
				source: input2,
			},
			{
				type: TokenType.operator,
				operator: Operator.and,
				from: 2,
				to: 5,
				source: input2,
			},
			{
				characters: 'B',
				type: TokenType.variable,
				from: 6,
				to: 7,
				source: input2,
			},
		],
		input2,
	);

	const input3 = `a ${OperatorSymbols.xor} b`;
	t.deepEqual<Token[], Token[]>(
		tokenize(input3),
		[
			{
				characters: 'A',
				type: TokenType.variable,
				from: 0,
				to: 1,
				source: input3,
			},
			{
				type: TokenType.operator,
				operator: Operator.xor,
				from: 2,
				to: 3,
				source: input3,
			},
			{
				characters: 'B',
				type: TokenType.variable,
				from: 4,
				to: 5,
				source: input3,
			},
		],
		input3,
	);

	const input4 = `a ${OperatorSymbols.and} ${OperatorSymbols.not.repeat(4)} b`;
	t.deepEqual<Token[], Token[]>(
		tokenize(input4),
		[
			{
				characters: 'A',
				type: TokenType.variable,
				from: 0,
				to: 1,
				source: input4,
			},
			{
				type: TokenType.operator,
				operator: Operator.and,
				from: 2,
				to: 3,
				source: input4,
			},
			{
				type: TokenType.operator,
				operator: Operator.not,
				from: 4,
				to: 5,
				source: input4,
			},
			{
				type: TokenType.operator,
				operator: Operator.not,
				from: 5,
				to: 6,
				source: input4,
			},
			{
				type: TokenType.operator,
				operator: Operator.not,
				from: 6,
				to: 7,
				source: input4,
			},
			{
				type: TokenType.operator,
				operator: Operator.not,
				from: 7,
				to: 8,
				source: input4,
			},
			{
				characters: 'B',
				type: TokenType.variable,
				from: 9,
				to: 10,
				source: input4,
			},
		],
		input4,
	);

	const input5 = '((((a) & (b))))';
	t.deepEqual<Token[], Token[]>(
		tokenize(input5),
		[
			{
				type: TokenType.bracket,
				bracketType: 'open',
				from: 0,
				to: 1,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'open',
				from: 1,
				to: 2,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'open',
				from: 2,
				to: 3,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'open',
				from: 3,
				to: 4,
				source: input5,
			},
			{
				characters: 'A',
				type: TokenType.variable,
				from: 4,
				to: 5,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
				from: 5,
				to: 6,
				source: input5,
			},
			{
				type: TokenType.operator,
				operator: Operator.and,
				from: 7,
				to: 8,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'open',
				from: 9,
				to: 10,
				source: input5,
			},
			{
				characters: 'B',
				type: TokenType.variable,
				from: 10,
				to: 11,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
				from: 11,
				to: 12,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
				from: 12,
				to: 13,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
				from: 13,
				to: 14,
				source: input5,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
				from: 14,
				to: 15,
				source: input5,
			},
		],
		input5,
	);
});
