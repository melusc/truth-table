import assert from 'node:assert/strict';
import test from 'node:test';

import {tokenize} from '../../src/tokenize.js';
import {validateMatchedParens} from '../../src/validate/validate-matched-parens.js';

const doValidate = (input: string): void => {
	validateMatchedParens(tokenize(input));
};

await test('validateMatchedParens', () => {
	assert.doesNotThrow(() => {
		doValidate('((((a) & (b))))');
	});

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
