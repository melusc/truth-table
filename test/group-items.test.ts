import test from 'ava';

import {groupItems} from '../src/group-items.js';
import {
	CharacterTypes,
	fromString,
	type StringWithIndices,
} from '../src/string-with-indices.js';

// No validation, input just has to be correct
const groupBracketsString = (input: string): StringWithIndices[][] =>
	groupItems(fromString(input));

const t1 = 'a ((b)) c (d) e';
test(t1, t => {
	t.deepEqual<StringWithIndices[][], StringWithIndices[][]>(
		groupBracketsString(t1),
		[
			[
				{
					characters: 'A',
					type: CharacterTypes.variable,
					from: 0,
					to: 1,
					source: t1,
				},
			],
			[
				{
					characters: '(',
					type: CharacterTypes.bracket,
					from: 2,
					to: 3,
					source: t1,
				},
				{
					characters: '(',
					type: CharacterTypes.bracket,
					from: 3,
					to: 4,
					source: t1,
				},
				{
					characters: 'B',
					type: CharacterTypes.variable,
					from: 4,
					to: 5,
					source: t1,
				},
				{
					characters: ')',
					type: CharacterTypes.bracket,
					from: 5,
					to: 6,
					source: t1,
				},
				{
					characters: ')',
					type: CharacterTypes.bracket,
					from: 6,
					to: 7,
					source: t1,
				},
			],
			[
				{
					characters: 'C',
					type: CharacterTypes.variable,
					from: 8,
					to: 9,
					source: t1,
				},
			],
			[
				{
					characters: '(',
					type: CharacterTypes.bracket,
					from: 10,
					to: 11,
					source: t1,
				},
				{
					characters: 'D',
					type: CharacterTypes.variable,
					from: 11,
					to: 12,
					source: t1,
				},
				{
					characters: ')',
					type: CharacterTypes.bracket,
					from: 12,
					to: 13,
					source: t1,
				},
			],
			[
				{
					characters: 'E',
					type: CharacterTypes.variable,
					from: 14,
					to: 15,
					source: t1,
				},
			],
		],
	);
});

const t2 = 'a b';
test(t2, t => {
	t.deepEqual<StringWithIndices[][], StringWithIndices[][]>(
		groupBracketsString(t2),
		[
			[
				{
					characters: 'A',
					type: CharacterTypes.variable,
					from: 0,
					to: 1,
					source: t2,
				},
			],
			[
				{
					characters: 'B',
					type: CharacterTypes.variable,
					from: 2,
					to: 3,
					source: t2,
				},
			],
		],
	);
});

const t3 = '(a) & ( b )';
test(t3, t => {
	t.deepEqual<StringWithIndices[][], StringWithIndices[][]>(
		groupBracketsString(t3),
		[
			[
				{
					characters: '(',
					type: CharacterTypes.bracket,
					from: 0,
					to: 1,
					source: t3,
				},
				{
					characters: 'A',
					type: CharacterTypes.variable,
					from: 1,
					to: 2,
					source: t3,
				},
				{
					characters: ')',
					type: CharacterTypes.bracket,
					from: 2,
					to: 3,
					source: t3,
				},
			],
			[
				{
					characters: '&',
					type: CharacterTypes.operator,
					from: 4,
					to: 5,
					source: t3,
				},
			],
			[
				{
					characters: '(',
					type: CharacterTypes.bracket,
					from: 6,
					to: 7,
					source: t3,
				},
				{
					characters: 'B',
					type: CharacterTypes.variable,
					from: 8,
					to: 9,
					source: t3,
				},
				{
					characters: ')',
					type: CharacterTypes.bracket,
					from: 10,
					to: 11,
					source: t3,
				},
			],
		],
	);
});

const t4 = '((a) & b)';
test(t4, t => {
	t.deepEqual<StringWithIndices[][], StringWithIndices[][]>(
		groupBracketsString(t4),
		[
			[
				{
					characters: '(',
					type: CharacterTypes.bracket,
					from: 0,
					to: 1,
					source: t4,
				},
				{
					characters: '(',
					type: CharacterTypes.bracket,
					from: 1,
					to: 2,
					source: t4,
				},
				{
					characters: 'A',
					type: CharacterTypes.variable,
					from: 2,
					to: 3,
					source: t4,
				},
				{
					characters: ')',
					type: CharacterTypes.bracket,
					from: 3,
					to: 4,
					source: t4,
				},
				{
					characters: '&',
					type: CharacterTypes.operator,
					from: 5,
					to: 6,
					source: t4,
				},
				{
					characters: 'B',
					type: CharacterTypes.variable,
					from: 7,
					to: 8,
					source: t4,
				},
				{
					characters: ')',
					type: CharacterTypes.bracket,
					from: 8,
					to: 9,
					source: t4,
				},
			],
		],
	);
});
