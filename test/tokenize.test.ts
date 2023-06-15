import test from 'ava';

import {LogicalSymbolFromName} from '../src/logical-symbols.js';
import {TokenType, tokenize, type Tokens} from '../src/tokenize.js';

test('tokenize', t => {
	t.deepEqual<Tokens[], Tokens[]>(
		tokenize('äöü'),
		[
			{
				characters: 'ÄÖÜ',
				type: TokenType.operator,
				from: 0,
				to: 3,
				source: 'äöü',
			},
		],
		'äöü',
	);

	t.deepEqual<Tokens[], Tokens[]>(
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
	t.deepEqual<Tokens[], Tokens[]>(
		tokenize(brackets1),
		[...brackets1].map((c, i) => ({
			characters: c,
			type: TokenType.bracket,
			from: i,
			to: i + 1,
			source: brackets1,
		})),
		brackets1,
	);

	const input1 = '(A)&(B)';
	t.deepEqual<Tokens[], Tokens[]>(
		tokenize(input1),
		[
			{
				characters: '(',
				type: TokenType.bracket,
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
				characters: ')',
				type: TokenType.bracket,
				from: 2,
				to: 3,
				source: input1,
			},
			{
				characters: '&',
				type: TokenType.operator,
				from: 3,
				to: 4,
				source: input1,
			},
			{
				characters: '(',
				type: TokenType.bracket,
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
				characters: ')',
				type: TokenType.bracket,
				from: 6,
				to: 7,
				source: input1,
			},
		],
		input1,
	);

	const input2 = 'a AND b';
	t.deepEqual<Tokens[], Tokens[]>(
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
				characters: 'AND',
				type: TokenType.variable,
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

	const input3 = `a ${LogicalSymbolFromName.and}?&? b`;
	t.deepEqual<Tokens[], Tokens[]>(
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
				characters: `${LogicalSymbolFromName.and}?&?`,
				type: TokenType.operator,
				from: 2,
				to: 6,
				source: input3,
			},
			{
				characters: 'B',
				type: TokenType.variable,
				from: 7,
				to: 8,
				source: input3,
			},
		],
		input3,
	);

	const input4 = `a ${
		LogicalSymbolFromName.and
	} ${LogicalSymbolFromName.not.repeat(4)} b`;
	t.deepEqual<Tokens[], Tokens[]>(
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
				characters: LogicalSymbolFromName.and,
				type: TokenType.operator,
				from: 2,
				to: 3,
				source: input4,
			},
			{
				characters: LogicalSymbolFromName.not.repeat(4),
				type: TokenType.operator,
				from: 4,
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
	t.deepEqual<Tokens[], Tokens[]>(
		tokenize(input5),
		[
			{
				characters: '(',
				type: TokenType.bracket,
				from: 0,
				to: 1,
				source: input5,
			},
			{
				characters: '(',
				type: TokenType.bracket,
				from: 1,
				to: 2,
				source: input5,
			},
			{
				characters: '(',
				type: TokenType.bracket,
				from: 2,
				to: 3,
				source: input5,
			},
			{
				characters: '(',
				type: TokenType.bracket,
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
				characters: ')',
				type: TokenType.bracket,
				from: 5,
				to: 6,
				source: input5,
			},
			{
				characters: '&',
				type: TokenType.operator,
				from: 7,
				to: 8,
				source: input5,
			},
			{
				characters: '(',
				type: TokenType.bracket,
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
				characters: ')',
				type: TokenType.bracket,
				from: 11,
				to: 12,
				source: input5,
			},
			{
				characters: ')',
				type: TokenType.bracket,
				from: 12,
				to: 13,
				source: input5,
			},
			{
				characters: ')',
				type: TokenType.bracket,
				from: 13,
				to: 14,
				source: input5,
			},
			{
				characters: ')',
				type: TokenType.bracket,
				from: 14,
				to: 15,
				source: input5,
			},
		],
		input5,
	);
});
