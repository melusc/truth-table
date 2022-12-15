import test from 'ava';

import {splitOperators} from '../src/split-operators.js';
import {
	CharacterTypes,
	fromString,
	type StringWithIndices,
} from '../src/string-with-indices.js';

const doSplit = (input: string): StringWithIndices[] =>
	splitOperators(fromString(input));

const t1 = 'a && !!!b';
test(t1, t => {
	t.deepEqual(doSplit(t1), [
		{
			characters: 'A',
			type: CharacterTypes.variable,
			originalCharacters: 'a',
			from: 0,
			to: 1,
		},
		{
			characters: '&&',
			type: CharacterTypes.operator,
			originalCharacters: '&&',
			from: 2,
			to: 4,
		},
		{
			characters: '!',
			type: CharacterTypes.operator,
			originalCharacters: '!',
			from: 5,
			to: 6,
		},
		{
			characters: '!',
			type: CharacterTypes.operator,
			originalCharacters: '!',
			from: 6,
			to: 7,
		},
		{
			characters: '!',
			type: CharacterTypes.operator,
			originalCharacters: '!',
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
	]);
});

const t2 = 'a && !!==b';
test(t2, t => {
	t.deepEqual(doSplit(t2), [
		{
			characters: 'A',
			type: CharacterTypes.variable,
			originalCharacters: 'a',
			from: 0,
			to: 1,
		},
		{
			characters: '&&',
			type: CharacterTypes.operator,
			originalCharacters: '&&',
			from: 2,
			to: 4,
		},
		{
			characters: '!',
			type: CharacterTypes.operator,
			originalCharacters: '!',
			from: 5,
			to: 6,
		},
		{
			characters: '!==',
			type: CharacterTypes.operator,
			originalCharacters: '!==',
			from: 6,
			to: 9,
		},
		{
			characters: 'B',
			type: CharacterTypes.variable,
			originalCharacters: 'b',
			from: 9,
			to: 10,
		},
	]);
});

const t3 = 'a && !!==!==b';
test(t3, t => {
	t.deepEqual(doSplit(t3), [
		{
			characters: 'A',
			type: CharacterTypes.variable,
			originalCharacters: 'a',
			from: 0,
			to: 1,
		},
		{
			characters: '&&',
			type: CharacterTypes.operator,
			originalCharacters: '&&',
			from: 2,
			to: 4,
		},
		{
			characters: '!',
			type: CharacterTypes.operator,
			originalCharacters: '!',
			from: 5,
			to: 6,
		},
		{
			characters: '!==!==',
			type: CharacterTypes.operator,
			originalCharacters: '!==!==',
			from: 6,
			to: 12,
		},
		{
			characters: 'B',
			type: CharacterTypes.variable,
			originalCharacters: 'b',
			from: 12,
			to: 13,
		},
	]);
});
