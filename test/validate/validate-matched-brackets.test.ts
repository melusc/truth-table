import test from 'ava';

import {validateMatchedBrackets} from '../../src/validate/validate-matched-brackets.js';
import {tokenize} from '../../src/tokenize.js';
import {IndexedError} from '../../src/indexed-error.js';

const doValidate = (input: string): void => {
	validateMatchedBrackets(tokenize(input));
};

test('findUnmatchedBrackets', t => {
	t.notThrows(() => {
		doValidate('((((a) & (b))))');
	}, '((((a) & (b))))');

	t.throws(
		() => {
			doValidate(')');
		},
		{
			message: 'Unmatched closing bracket at position 0.',
			instanceOf: IndexedError,
		},
		')',
	);

	t.throws(
		() => {
			doValidate('((()');
		},
		{
			message: 'Unmatched opening bracket at position 1.',
			instanceOf: IndexedError,
		},
		'((()',
	);

	t.throws(
		() => {
			doValidate('((())))');
		},
		{
			message: 'Unmatched closing bracket at position 6.',
			instanceOf: IndexedError,
		},
		'((())))',
	);

	t.throws(
		() => {
			doValidate(')');
		},
		{
			message: 'Unmatched closing bracket at position 0.',
			instanceOf: IndexedError,
		},
	);

	t.throws(
		() => {
			doValidate('(a & b');
		},
		{
			message: 'Unmatched opening bracket at position 0.',
			instanceOf: IndexedError,
		},
	);
});
