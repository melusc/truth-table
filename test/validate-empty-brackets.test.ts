import test from 'ava';

import {IndexedError} from '../src/indexed-error.js';
import {tokenize} from '../src/tokenize.js';
import {validateEmptyBrackets} from '../src/validate-empty-brackets.js';

const doValidate = (input: string): void => {
	validateEmptyBrackets(tokenize(input));
};

test('validateEmptyBrackets', t => {
	t.notThrows(() => {
		doValidate('(a)');
	}, '(a)');

	t.notThrows(() => {
		doValidate('a && b');
	}, 'a && b');

	t.throws(
		() => {
			doValidate('()');
		},
		{
			message: 'Unexpected empty brackets at (0 - 2).',
			instanceOf: IndexedError,
		},
		'()',
	);

	t.throws(
		() => {
			doValidate('( )');
		},
		{
			message: 'Unexpected empty brackets at (0 - 3).',
			instanceOf: IndexedError,
		},
		'( )',
	);

	t.throws(
		() => {
			doValidate('((((((()))))))');
		},
		{
			message: 'Unexpected empty brackets at (6 - 8).',
			instanceOf: IndexedError,
		},
		'((((((()))))))',
	);

	t.throws(
		() => {
			doValidate('(((((((    )))))))');
		},
		{
			message: 'Unexpected empty brackets at (6 - 12).',
			instanceOf: IndexedError,
		},
		'(((((((    )))))))',
	);

	t.throws(
		() => {
			doValidate('()()()()()');
		},
		{
			message: 'Unexpected empty brackets at (0 - 2).',
			instanceOf: IndexedError,
		},
		'()()()()()',
	);

	t.throws(
		() => {
			doValidate(')(');
		},
		{
			message: 'Unexpected opening bracket at position 1.',
			instanceOf: IndexedError,
		},
		')(',
	);
});
