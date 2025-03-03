import assert from 'node:assert/strict';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import test from 'node:test';

import {tokenize} from '../../src/tokenize.js';
import {validateEmptyParens} from '../../src/validate/validate-empty-parens.js';

const doValidate = (input: string): void => {
	validateEmptyParens(tokenize(input));
};

await test('validateEmptyParens', () => {
	assert.doesNotThrow(() => {
		doValidate('(a)');
	}, '(a)');

	assert.doesNotThrow(() => {
		doValidate('a && b');
	}, 'a && b');

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
