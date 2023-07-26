import test from 'ava';

import {groupItems} from '../src/group-items.js';
import {Operator} from '../src/operators.js';
import {TokenType, tokenize, type Token} from '../src/tokenize.js';

// No validation, input just has to be correct
const groupBracketsString = (input: string): Token[][] =>
	groupItems(tokenize(input));

const t1 = 'a ((b)) c (d) e';
test(t1, t => {
	t.like(groupBracketsString(t1), [
		[
			{
				characters: 'A',
				type: TokenType.variable,
			},
		],
		[
			{
				type: TokenType.bracket,
				bracketType: 'open',
			},
			{
				type: TokenType.bracket,
				bracketType: 'open',
			},
			{
				characters: 'B',
				type: TokenType.variable,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
			},
		],
		[
			{
				characters: 'C',
				type: TokenType.variable,
			},
		],
		[
			{
				type: TokenType.bracket,
				bracketType: 'open',
			},
			{
				characters: 'D',
				type: TokenType.variable,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
			},
		],
		[
			{
				characters: 'E',
				type: TokenType.variable,
			},
		],
	]);
});

const t2 = 'a b';
test(t2, t => {
	t.like(groupBracketsString(t2), [
		[
			{
				characters: 'A',
				type: TokenType.variable,
			},
		],
		[
			{
				characters: 'B',
				type: TokenType.variable,
			},
		],
	]);
});

const t3 = '(a) & ( b )';
test(t3, t => {
	t.like(groupBracketsString(t3), [
		[
			{
				type: TokenType.bracket,
				bracketType: 'open',
			},
			{
				characters: 'A',
				type: TokenType.variable,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
			},
		],
		[
			{
				type: TokenType.operator,
				operator: Operator.and,
			},
		],
		[
			{
				type: TokenType.bracket,
				bracketType: 'open',
			},
			{
				characters: 'B',
				type: TokenType.variable,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
			},
		],
	]);
});

const t4 = '((a) & b)';
test(t4, t => {
	t.like(groupBracketsString(t4), [
		[
			{
				type: TokenType.bracket,
				bracketType: 'open',
			},
			{
				type: TokenType.bracket,
				bracketType: 'open',
			},
			{
				characters: 'A',
				type: TokenType.variable,
				from: 2,
				to: 3,
				source: t4,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
			},
			{
				type: TokenType.operator,
				operator: Operator.and,
				from: 5,
				to: 6,
				source: t4,
			},
			{
				characters: 'B',
				type: TokenType.variable,
				from: 7,
				to: 8,
				source: t4,
			},
			{
				type: TokenType.bracket,
				bracketType: 'close',
				from: 8,
				to: 9,
				source: t4,
			},
		],
	]);
});
