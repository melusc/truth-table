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

import {tokenize} from '../../src/tokenize.js';
import {validateEmptyParens} from '../../src/validate/validate-empty-parens.js';

const doValidate = (input: string): void => {
	validateEmptyParens(tokenize(input));
};

await test('validateEmptyParens', () => {
	// These shouldn't throw
	doValidate('(a)');
	doValidate('a && b');

	assert.throws(
		() => {
			doValidate('()');
		},
		{
			message: 'Unexpected empty parentheses at (0 - 2).',
			from: 0,
			to: 2,
			name: 'IndexedError',
		},
		'()',
	);

	assert.throws(
		() => {
			doValidate('( )');
		},
		{
			message: 'Unexpected empty parentheses at (0 - 3).',
			from: 0,
			to: 3,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate('((((((()))))))');
		},
		{
			message: 'Unexpected empty parentheses at (6 - 8).',
			from: 6,
			to: 8,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate('(((((((    )))))))');
		},
		{
			message: 'Unexpected empty parentheses at (6 - 12).',
			from: 6,
			to: 12,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate('()()()()()');
		},
		{
			message: 'Unexpected empty parentheses at (0 - 2).',
			from: 0,
			to: 2,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate(')(');
		},
		{
			message: 'Unexpected opening parentheses at position 1.',
			from: 1,
			to: 2,
			name: 'IndexedError',
		},
	);
});
