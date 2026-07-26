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

import {TokenType, tokenize} from '../../src/tokenize.js';

const doNormaliseOperators = (input: string): string =>
	tokenize(input)
		.map(item => {
			if (item.type === TokenType.operator) {
				return item.operator;
			}

			if (item.type === TokenType.variable) {
				return item.characters;
			}

			return item.parensType === 'open' ? '(' : ')';
		})
		.join(' ');

const makeTest = async (
	operatorName: string,
	expected: string,
	items: string[],
): Promise<void> =>
	test(`replace to ${operatorName}`, () => {
		for (const item of items) {
			// eslint-disable-next-line node-test/no-conditional-assertion
			assert.equal(doNormaliseOperators(item), expected, item);
		}
	});

await makeTest('iff', 'A iff B', [
	'A iff B',
	'A ⇔ B',
	'A ≡ B',
	'A <-> B',
	'A <=> B',
	'A = B',
	'A == B',
	'A === B',
	'A ⟷ B',
	'A XNOR B',
]);

await makeTest('ifthen', 'A ifthen B', [
	'A ⇒ B',
	'A ⊃ B',
	'A -> B',
	'A => B',
	'A → B',
	'A |= B',
	'A ⊧ B',
	'A |- B',
	'A ⊦ B',
	'A ⟝ B',
]);

await makeTest('not', 'not A', ['NOT A', '! A', '~ A', '¬ A']);

await makeTest('and', 'A and B', [
	'A && B',
	'A & B',
	'A AND B',
	'A ∧ B',
	'A * B',
]);

await makeTest('nand', 'A nand B', ['A ⊼ B']);

await makeTest('xor', 'A xor B', [
	'A ⊕ B',
	'A ⊻ B',
	'A ≢ B',
	'A >=< B',
	'A >-< B',
	'A != B',
	'A !== B',
	'A ~= B',
	'A <> B',
	'A XOR B',
	'A ↮ B',
	'A ^ B',
]);

await makeTest('or', 'A or B', ['A || B', 'A | B', 'A OR B', 'A ∨ B', 'A + B']);

await makeTest('nor', 'A nor B', ['A ⊽ B']);

const t1 = '(a && b) || (c !== ! d)';
await test(t1, () => {
	assert.equal(doNormaliseOperators(t1), '( A and B ) or ( C xor not D )', t1);
});
