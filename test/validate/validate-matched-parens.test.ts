import test from 'ava';

import {IndexedError} from '../../src/indexed-error.js';
import {tokenize} from '../../src/tokenize.js';
import {validateMatchedParens} from '../../src/validate/validate-matched-parens.js';

const doValidate = (input: string): void => {
	validateMatchedParens(tokenize(input));
};

test('validateMatchedParens', t => {
	t.notThrows(() => {
		doValidate('((((a) & (b))))');
	}, '((((a) & (b))))');

	t.throws(
		() => {
			doValidate(')');
		},
		{
			message: 'Unmatched parenthesis at position 0.',
			instanceOf: IndexedError,
		},
		')',
	);

	t.throws(
		() => {
			doValidate('((()');
		},
		{
			message: 'Unmatched parenthesis at position 1.',
			instanceOf: IndexedError,
		},
		'((()',
	);

	t.throws(
		() => {
			doValidate('((())))');
		},
		{
			message: 'Unmatched parenthesis at position 6.',
			instanceOf: IndexedError,
		},
		'((())))',
	);

	t.throws(
		() => {
			doValidate(')');
		},
		{
			message: 'Unmatched parenthesis at position 0.',
			instanceOf: IndexedError,
		},
	);

	t.throws(
		() => {
			doValidate('(a & b');
		},
		{
			message: 'Unmatched parenthesis at position 0.',
			instanceOf: IndexedError,
		},
	);
});
