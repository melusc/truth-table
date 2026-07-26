/*!
 * This file is part of @lusc/truth-table, a logic parser and table generator.
 * Copyright (C) 2026, Luca Schnellmann <oss@lusc.ch>

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
			// eslint-disable-next-line node-test/no-conditional-assertion
			assert.ok(expectedGroup);
			// eslint-disable-next-line node-test/no-conditional-assertion
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
