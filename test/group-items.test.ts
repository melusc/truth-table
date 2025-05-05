import assert from 'node:assert/strict';
import test from 'node:test';

import {groupItems} from '../src/group-items.js';
import {Operator} from '../src/operators.js';
import {TokenType, tokenize, type Token} from '../src/tokenize.js';

type SimplifyToken<T> = T extends unknown
	? Omit<T, 'from' | 'to' | 'source'>
	: never;

async function groupItemsTest(
	input: string,
	expected: Array<Array<SimplifyToken<Token>>>,
) {
	await test(input, () => {
		const result = groupItems(tokenize(input));

		for (const [index, group] of result.entries()) {
			const expectedGroup = expected[index];
			assert.ok(expectedGroup);
			assert.deepEqual(
				group.map(({from: _from, to: _to, source: _source, ...rest}) => rest),
				expectedGroup,
			);
		}
	});
}

const t1 = 'a ((b)) c (d) e';
await groupItemsTest(t1, [
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

const t2 = 'a b';
await groupItemsTest(t2, [
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

const t3 = '(a) & ( b )';
await groupItemsTest(t3, [
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

const t4 = '((a) & b)';
await groupItemsTest(t4, [
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
		},
		{
			type: TokenType.parens,
			parensType: 'close',
		},
		{
			type: TokenType.operator,
			operator: Operator.and,
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
