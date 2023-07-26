import test from 'ava';

import {groupItems} from '../src/group-items.js';
import {Operator} from '../src/operators.js';
import {TokenType, tokenize, type Token} from '../src/tokenize.js';

// No validation, input just has to be correct
const groupItemsString = (input: string): Token[][] =>
	groupItems(tokenize(input));

const t1 = 'a ((b)) c (d) e';
test(t1, t => {
	t.like(groupItemsString(t1), [
		[
			{
				characters: 'A',
				type: TokenType.variable,
			},
		],
		[
			{
				type: TokenType.parens,
				parensType: 'open',
			},
			{
				type: TokenType.parens,
				parensType: 'open',
			},
			{
				characters: 'B',
				type: TokenType.variable,
			},
			{
				type: TokenType.parens,
				parensType: 'close',
			},
			{
				type: TokenType.parens,
				parensType: 'close',
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
				type: TokenType.parens,
				parensType: 'open',
			},
			{
				characters: 'D',
				type: TokenType.variable,
			},
			{
				type: TokenType.parens,
				parensType: 'close',
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
	t.like(groupItemsString(t2), [
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
	t.like(groupItemsString(t3), [
		[
			{
				type: TokenType.parens,
				parensType: 'open',
			},
			{
				characters: 'A',
				type: TokenType.variable,
			},
			{
				type: TokenType.parens,
				parensType: 'close',
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
				type: TokenType.parens,
				parensType: 'open',
			},
			{
				characters: 'B',
				type: TokenType.variable,
			},
			{
				type: TokenType.parens,
				parensType: 'close',
			},
		],
	]);
});

const t4 = '((a) & b)';
test(t4, t => {
	t.like(groupItemsString(t4), [
		[
			{
				type: TokenType.parens,
				parensType: 'open',
			},
			{
				type: TokenType.parens,
				parensType: 'open',
			},
			{
				characters: 'A',
				type: TokenType.variable,
				from: 2,
				to: 3,
				source: t4,
			},
			{
				type: TokenType.parens,
				parensType: 'close',
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
				type: TokenType.parens,
				parensType: 'close',
				from: 8,
				to: 9,
				source: t4,
			},
		],
	]);
});
