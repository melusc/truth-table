import test from 'ava';

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

const makeTest = (
	operatorName: string,
	expected: string,
	items: string[],
): void => {
	test(`replace to ${operatorName}`, t => {
		for (const item of items) {
			t.is(doNormaliseOperators(item), expected, item);
		}
	});
};

makeTest('iff', 'A iff B', [
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

makeTest('ifthen', 'A ifthen B', [
	'A ⇒ B',
	'A ⊃ B',
	'A -> B',
	'A => B',
	'A → B',
]);

makeTest('not', 'not A', ['NOT A', '! A', '~ A', '¬ A']);

makeTest('and', 'A and B', ['A && B', 'A & B', 'A AND B', 'A ∧ B', 'A * B']);

makeTest('nand', 'A nand B', ['A ⊼ B']);

makeTest('xor', 'A xor B', [
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

makeTest('or', 'A or B', ['A || B', 'A | B', 'A OR B', 'A ∨ B', 'A + B']);

makeTest('nor', 'A nor B', ['A ⊽ B']);

const t1 = '(a && b) || (c !== ! d)';
test(t1, t => {
	t.is(doNormaliseOperators(t1), '( A and B ) or ( C xor not D )', t1);
});
