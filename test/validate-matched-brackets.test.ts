import test from 'ava';

import {validateMatchedBrackets} from '../src/validate-matched-brackets.js';
import {fromString} from '../src/string-with-indices.js';
import {IndexedError} from '../src/indexed-error.js';

const doValidate = (input: string): void => {
	validateMatchedBrackets(fromString(input));
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
});
