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

import {OperatorSymbols} from '../../src/operators.js';
import {tokenize} from '../../src/tokenize.js';
import {validateNots} from '../../src/validate/validate-nots.js';

const doValidate = (input: string): void => {
	validateNots(tokenize(input));
};

await test('validateNots', () => {
	// This shouldn't throw
	doValidate(`a${OperatorSymbols.and}${OperatorSymbols.not.repeat(2)}b`);

	assert.throws(
		() => {
			doValidate(`a ${OperatorSymbols.not} && b`);
		},
		{
			message: 'Unexpected operator "&&".',
			from: 4,
			to: 6,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate(`a ${OperatorSymbols.not} & !b`);
		},
		{
			message: 'Unexpected operator "&".',
			from: 4,
			to: 5,
			name: 'IndexedError',
		},
	);
});
