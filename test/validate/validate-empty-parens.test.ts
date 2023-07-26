import test from 'ava';

import {IndexedError} from '../../src/indexed-error.js';
import {tokenize} from '../../src/tokenize.js';
import {validateEmptyParens} from '../../src/validate/validate-empty-parens.js';

const doValidate = (input: string): void => {
	validateEmptyParens(tokenize(input));
};

test('validateEmptyParens', t => {
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
			message: 'Unexpected empty parentheses at (0 - 2).',
			instanceOf: IndexedError,
		},
		'()',
	);

	t.throws(
		() => {
			doValidate('( )');
		},
		{
			message: 'Unexpected empty parentheses at (0 - 3).',
			instanceOf: IndexedError,
		},
		'( )',
	);

	t.throws(
		() => {
			doValidate('((((((()))))))');
		},
		{
			message: 'Unexpected empty parentheses at (6 - 8).',
			instanceOf: IndexedError,
		},
		'((((((()))))))',
	);

	t.throws(
		() => {
			doValidate('(((((((    )))))))');
		},
		{
			message: 'Unexpected empty parentheses at (6 - 12).',
			instanceOf: IndexedError,
		},
		'(((((((    )))))))',
	);

	t.throws(
		() => {
			doValidate('()()()()()');
		},
		{
			message: 'Unexpected empty parentheses at (0 - 2).',
			instanceOf: IndexedError,
		},
		'()()()()()',
	);

	t.throws(
		() => {
			doValidate(')(');
		},
		{
			message: 'Unexpected opening parentheses at position 1.',
			instanceOf: IndexedError,
		},
		')(',
	);
});
