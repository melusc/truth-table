import test from 'ava';
import {LogicalSymbolFromName} from '../src/logical-symbols.js';
import {CharacterTypes, fromString} from '../src/string-with-indices.js';

test('fromString', t => {
	t.deepEqual(
		fromString('äöü'),
		[
			{
				characters: 'ÄÖÜ',
				type: CharacterTypes.operator,
				originalCharacters: 'äöü',
				from: 0,
				to: 3,
			},
		],
		'äöü',
	);

	t.deepEqual(
		fromString('abcd'),
		[
			{
				characters: 'ABCD',
				type: CharacterTypes.variable,
				originalCharacters: 'abcd',
				from: 0,
				to: 4,
			},
		],
		'abcd',
	);

	// Doesn't validate brackets
	t.deepEqual(
		fromString(')((()())))'),
		[
			{
				characters: ')((()())))',
				type: CharacterTypes.bracket,
				originalCharacters: ')((()())))',
				from: 0,
				to: 10,
			},
		],
		')((()())))',
	);

	t.deepEqual(
		fromString('(A)&(B)'),
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
				originalCharacters: 'A',
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
			{
				characters: '&',
				type: CharacterTypes.operator,
				originalCharacters: '&',
				from: 3,
				to: 4,
			},
			{
				characters: '(',
				type: CharacterTypes.bracket,
				originalCharacters: '(',
				from: 4,
				to: 5,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				originalCharacters: 'B',
				from: 5,
				to: 6,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				originalCharacters: ')',
				from: 6,
				to: 7,
			},
		],
		'(A)&(B)',
	);

	t.deepEqual(
		fromString('a AND b'),
		[
			{
				characters: 'A',
				type: CharacterTypes.variable,
				originalCharacters: 'a',
				from: 0,
				to: 1,
			},
			{
				characters: 'AND',
				type: CharacterTypes.variable,
				originalCharacters: 'AND',
				from: 2,
				to: 5,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				originalCharacters: 'b',
				from: 6,
				to: 7,
			},
		],
		'a AND b',
	);

	t.deepEqual(fromString(`a ${LogicalSymbolFromName.and}?&? b`), [
		{
			characters: 'A',
			type: CharacterTypes.variable,
			originalCharacters: 'a',
			from: 0,
			to: 1,
		},
		{
			characters: `${LogicalSymbolFromName.and}?&?`,
			type: CharacterTypes.operator,
			originalCharacters: `${LogicalSymbolFromName.and}?&?`,
			from: 2,
			to: 6,
		},
		{
			characters: 'B',
			type: CharacterTypes.variable,
			originalCharacters: 'b',
			from: 7,
			to: 8,
		},
	]);

	t.deepEqual(
		fromString(
			`a ${LogicalSymbolFromName.and} ${LogicalSymbolFromName.not.repeat(4)} b`,
		),
		[
			{
				characters: 'A',
				type: CharacterTypes.variable,
				originalCharacters: 'a',
				from: 0,
				to: 1,
			},
			{
				characters: LogicalSymbolFromName.and,
				type: CharacterTypes.operator,
				originalCharacters: LogicalSymbolFromName.and,
				from: 2,
				to: 3,
			},
			{
				characters: LogicalSymbolFromName.not.repeat(4),
				type: CharacterTypes.operator,
				originalCharacters: LogicalSymbolFromName.not.repeat(4),
				from: 4,
				to: 8,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				originalCharacters: 'b',
				from: 9,
				to: 10,
			},
		],
	);

	t.deepEqual(
		fromString('((((a) & (b))))'),
		[
			{
				characters: '((((',
				type: CharacterTypes.bracket,
				originalCharacters: '((((',
				from: 0,
				to: 4,
			},
			{
				characters: 'A',
				type: CharacterTypes.variable,
				originalCharacters: 'a',
				from: 4,
				to: 5,
			},
			{
				characters: ')',
				type: CharacterTypes.bracket,
				originalCharacters: ')',
				from: 5,
				to: 6,
			},
			{
				characters: '&',
				type: CharacterTypes.operator,
				originalCharacters: '&',
				from: 7,
				to: 8,
			},
			{
				characters: '(',
				type: CharacterTypes.bracket,
				originalCharacters: '(',
				from: 9,
				to: 10,
			},
			{
				characters: 'B',
				type: CharacterTypes.variable,
				originalCharacters: 'b',
				from: 10,
				to: 11,
			},
			{
				characters: '))))',
				type: CharacterTypes.bracket,
				originalCharacters: '))))',
				from: 11,
				to: 15,
			},
		],
		'((((a) & (b))))',
	);
});
