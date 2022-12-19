import test from 'ava';
import {LogicalSymbolFromName} from '../src/logical-symbols.js';
import {
	CharacterTypes,
	fromString,
	type StringWithIndices,
} from '../src/string-with-indices.js';

test('fromString', t => {
	t.deepEqual<StringWithIndices[], StringWithIndices[]>(
		fromString('äöü'),
		[
			{
				characters: 'ÄÖÜ',
				type: CharacterTypes.operator,
				from: 0,
				to: 3,
				source: 'äöü',
			},
		],
		'äöü',
	);

	t.deepEqual<StringWithIndices[], StringWithIndices[]>(
		fromString('abcd'),
		[
			{
				characters: 'ABCD',
				type: CharacterTypes.variable,
				from: 0,
				to: 4,
				source: 'abcd',
			},
		],
		'abcd',
	);

	const brackets1 = ')((()())))';
	// Doesn't validate brackets
	t.deepEqual<StringWithIndices[], StringWithIndices[]>(
		fromString(brackets1),
		brackets1.split('').map((c, i) => ({
			characters: c,
			type: CharacterTypes.bracket,
			from: i,
			to: i + 1,
			source: brackets1,
		})),
		brackets1,
	);

	const input1 = '(A)&(B)';
	t.deepEqual<StringWithIndices[], StringWithIndices[]>(
		fromString(input1),
		[
			{
				characters: '(',
				type: CharacterTypes.bracket,
				from: 0,
				to: 1,
				source: input1,
			},
			{
				characters: 'A',
				type: CharacterTypes.variable,
				from: 1,
				to: 2,
				source: input1,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				from: 2,
				to: 3,
				source: input1,
			},
			{
				characters: '&',
				type: CharacterTypes.operator,
				from: 3,
				to: 4,
				source: input1,
			},
			{
				characters: '(',
				type: CharacterTypes.bracket,
				from: 4,
				to: 5,
				source: input1,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				from: 5,
				to: 6,
				source: input1,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				from: 6,
				to: 7,
				source: input1,
			},
		],
		input1,
	);

	const input2 = 'a AND b';
	t.deepEqual<StringWithIndices[], StringWithIndices[]>(
		fromString(input2),
		[
			{
				characters: 'A',
				type: CharacterTypes.variable,
				from: 0,
				to: 1,
				source: input2,
			},
			{
				characters: 'AND',
				type: CharacterTypes.variable,
				from: 2,
				to: 5,
				source: input2,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				from: 6,
				to: 7,
				source: input2,
			},
		],
		input2,
	);

	const input3 = `a ${LogicalSymbolFromName.and}?&? b`;
	t.deepEqual<StringWithIndices[], StringWithIndices[]>(
		fromString(input3),
		[
			{
				characters: 'A',
				type: CharacterTypes.variable,
				from: 0,
				to: 1,
				source: input3,
			},
			{
				characters: `${LogicalSymbolFromName.and}?&?`,
				type: CharacterTypes.operator,
				from: 2,
				to: 6,
				source: input3,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
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
	t.deepEqual<StringWithIndices[], StringWithIndices[]>(
		fromString(input4),
		[
			{
				characters: 'A',
				type: CharacterTypes.variable,
				from: 0,
				to: 1,
				source: input4,
			},
			{
				characters: LogicalSymbolFromName.and,
				type: CharacterTypes.operator,
				from: 2,
				to: 3,
				source: input4,
			},
			{
				characters: LogicalSymbolFromName.not.repeat(4),
				type: CharacterTypes.operator,
				from: 4,
				to: 8,
				source: input4,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				from: 9,
				to: 10,
				source: input4,
			},
		],
		input4,
	);

	const input5 = '((((a) & (b))))';
	t.deepEqual<StringWithIndices[], StringWithIndices[]>(
		fromString(input5),
		[
			{
				characters: '(',
				type: CharacterTypes.bracket,
				from: 0,
				to: 1,
				source: input5,
			},
			{
				characters: '(',
				type: CharacterTypes.bracket,
				from: 1,
				to: 2,
				source: input5,
			},
			{
				characters: '(',
				type: CharacterTypes.bracket,
				from: 2,
				to: 3,
				source: input5,
			},
			{
				characters: '(',
				type: CharacterTypes.bracket,
				from: 3,
				to: 4,
				source: input5,
			},
			{
				characters: 'A',
				type: CharacterTypes.variable,
				from: 4,
				to: 5,
				source: input5,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				from: 5,
				to: 6,
				source: input5,
			},
			{
				characters: '&',
				type: CharacterTypes.operator,
				from: 7,
				to: 8,
				source: input5,
			},
			{
				characters: '(',
				type: CharacterTypes.bracket,
				from: 9,
				to: 10,
				source: input5,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				from: 10,
				to: 11,
				source: input5,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				from: 11,
				to: 12,
				source: input5,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				from: 12,
				to: 13,
				source: input5,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				from: 13,
				to: 14,
				source: input5,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				from: 14,
				to: 15,
				source: input5,
			},
		],
		input5,
	);
});
