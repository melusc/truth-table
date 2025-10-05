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
