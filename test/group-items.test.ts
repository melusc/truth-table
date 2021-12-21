import test from 'ava';

import {groupItems} from '../src/group-items.js';
import {
	CharacterTypes,
	fromString,
	StringWithIndices,
} from '../src/string-with-indices.js';

// No validation, input just has to be correct
const groupBracketsString = (input: string): StringWithIndices[][] =>
	groupItems(fromString(input));

test('a ((b)) c (d) e', t => {
	t.deepEqual(groupBracketsString('a ((b)) c (d) e'), [
		[
			{
				characters: 'A',
				type: CharacterTypes.variable,
				originalCharacters: 'a',
				from: 0,
				to: 1,
			},
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 1,
				to: 2,
			},
		],
		[
			{
				characters: '((',
				type: CharacterTypes.bracket,
				originalCharacters: '((',
				from: 2,
				to: 4,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				originalCharacters: 'b',
				from: 4,
				to: 5,
			},
			{
				characters: '))',
				type: CharacterTypes.bracket,
				originalCharacters: '))',
				from: 5,
				to: 7,
			},
		],
		[
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 7,
				to: 8,
			},
			{
				characters: 'C',
				type: CharacterTypes.variable,
				originalCharacters: 'c',
				from: 8,
				to: 9,
			},
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 9,
				to: 10,
			},
		],
		[
			{
				characters: '(',
				type: CharacterTypes.bracket,
				originalCharacters: '(',
				from: 10,
				to: 11,
			},
			{
				characters: 'D',
				type: CharacterTypes.variable,
				originalCharacters: 'd',
				from: 11,
				to: 12,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				originalCharacters: ')',
				from: 12,
				to: 13,
			},
		],
		[
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 13,
				to: 14,
			},
			{
				characters: 'E',
				type: CharacterTypes.variable,
				originalCharacters: 'e',
				from: 14,
				to: 15,
			},
		],
	]);
});

test('a b', t => {
	t.deepEqual(groupBracketsString('a b'), [
		[
			{
				characters: 'A',
				type: CharacterTypes.variable,
				originalCharacters: 'a',
				from: 0,
				to: 1,
			},
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 1,
				to: 2,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				originalCharacters: 'b',
				from: 2,
				to: 3,
			},
		],
	]);
});

test('(a) & ( b )', t => {
	t.deepEqual(groupBracketsString('(a) & ( b )'), [
		[
			{
				characters: '(',
				type: CharacterTypes.bracket,
				originalCharacters: '(',
				from: 0,
				to: 1,
			},
			{
				characters: 'A',
				type: CharacterTypes.variable,
				originalCharacters: 'a',
				from: 1,
				to: 2,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				originalCharacters: ')',
				from: 2,
				to: 3,
			},
		],
		[
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 3,
				to: 4,
			},
		],
		[
			{
				characters: '&',
				type: CharacterTypes.operator,
				originalCharacters: '&',
				from: 4,
				to: 5,
			},
		],
		[
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 5,
				to: 6,
			},
		],
		[
			{
				characters: '(',
				type: CharacterTypes.bracket,
				originalCharacters: '(',
				from: 6,
				to: 7,
			},
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 7,
				to: 8,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				originalCharacters: 'b',
				from: 8,
				to: 9,
			},
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 9,
				to: 10,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				originalCharacters: ')',
				from: 10,
				to: 11,
			},
		],
	]);
});

test('((a) & b)', t => {
	t.deepEqual(groupBracketsString('((a) & b)'), [
		[
			{
				characters: '((',
				type: CharacterTypes.bracket,
				originalCharacters: '((',
				from: 0,
				to: 2,
			},
			{
				characters: 'A',
				type: CharacterTypes.variable,
				originalCharacters: 'a',
				from: 2,
				to: 3,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				originalCharacters: ')',
				from: 3,
				to: 4,
			},
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 4,
				to: 5,
			},
			{
				characters: '&',
				type: CharacterTypes.operator,
				originalCharacters: '&',
				from: 5,
				to: 6,
			},
			{
				characters: ' ',
				type: CharacterTypes.space,
				originalCharacters: ' ',
				from: 6,
				to: 7,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				originalCharacters: 'b',
				from: 7,
				to: 8,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				originalCharacters: ')',
				from: 8,
				to: 9,
			},
		],
	]);
});
