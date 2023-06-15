import test from 'ava';

import {splitOperators} from '../src/split-operators.js';
import {TokenType, tokenize, type Tokens} from '../src/tokenize.js';

const doSplit = (input: string): Tokens[] => splitOperators(tokenize(input));

const t1 = 'a && !!!b';
test(t1, t => {
	t.deepEqual<Tokens[], Tokens[]>(doSplit(t1), [
		{
			characters: 'A',
			type: TokenType.variable,
			from: 0,
			to: 1,
			source: t1,
		},
		{
			characters: '&&',
			type: TokenType.operator,
			from: 2,
			to: 4,
			source: t1,
		},
		{
			characters: '!',
			type: TokenType.operator,
			from: 5,
			to: 6,
			source: t1,
		},
		{
			characters: '!',
			type: TokenType.operator,
			from: 6,
			to: 7,
			source: t1,
		},
		{
			characters: '!',
			type: TokenType.operator,
			from: 7,
			to: 8,
			source: t1,
		},
		{
			characters: 'B',
			type: TokenType.variable,
			from: 8,
			to: 9,
			source: t1,
		},
	]);
});

const t2 = 'a && !!==b';
test(t2, t => {
	t.deepEqual<Tokens[], Tokens[]>(doSplit(t2), [
		{
			characters: 'A',
			type: TokenType.variable,
			from: 0,
			to: 1,
			source: t2,
		},
		{
			characters: '&&',
			type: TokenType.operator,
			from: 2,
			to: 4,
			source: t2,
		},
		{
			characters: '!',
			type: TokenType.operator,
			from: 5,
			to: 6,
			source: t2,
		},
		{
			characters: '!==',
			type: TokenType.operator,
			from: 6,
			to: 9,
			source: t2,
		},
		{
			characters: 'B',
			type: TokenType.variable,
			from: 9,
			to: 10,
			source: t2,
		},
	]);
});

const t3 = 'a && !!==!==b';
test(t3, t => {
	t.deepEqual<Tokens[], Tokens[]>(doSplit(t3), [
		{
			characters: 'A',
			type: TokenType.variable,
			from: 0,
			to: 1,
			source: t3,
		},
		{
			characters: '&&',
			type: TokenType.operator,
			from: 2,
			to: 4,
			source: t3,
		},
		{
			characters: '!',
			type: TokenType.operator,
			from: 5,
			to: 6,
			source: t3,
		},
		{
			characters: '!==!==',
			type: TokenType.operator,
			from: 6,
			to: 12,
			source: t3,
		},
		{
			characters: 'B',
			type: TokenType.variable,
			from: 12,
			to: 13,
			source: t3,
		},
	]);
});
