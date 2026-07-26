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
import {validateMatchedParens} from '../../src/validate/validate-matched-parens.js';

const doValidate = (input: string): void => {
	validateMatchedParens(tokenize(input));
};

await test('validateMatchedParens', () => {
	// This shouldn't throw
	doValidate('((((a) & (b))))');

	assert.throws(
		() => {
			doValidate(')');
		},
		{
			message: 'Unmatched parenthesis at position 0.',
			from: 0,
			to: 1,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate('((()');
		},
		{
			message: 'Unmatched parenthesis at position 1.',
			from: 1,
			to: 2,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate('((())))');
		},
		{
			message: 'Unmatched parenthesis at position 6.',
			from: 6,
			to: 7,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate(')');
		},
		{
			message: 'Unmatched parenthesis at position 0.',
			from: 0,
			to: 1,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate('(a & b');
		},
		{
			message: 'Unmatched parenthesis at position 0.',
			from: 0,
			to: 1,
			name: 'IndexedError',
		},
	);
});
