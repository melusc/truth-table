import test from 'ava';

import {IndexedError} from '../src/indexed-error.js';
import {LogicalSymbolFromName} from '../src/logical-symbols.js';
import {normaliseOperators} from '../src/operator-alias.js';
import {CharacterTypes, fromString} from '../src/string-with-indices.js';
import {validateCharacters} from '../src/validate-characters.js';

const doValidate = (input: string): void => {
	validateCharacters(normaliseOperators(fromString(input)));
};

test('validateCharacters', t => {
	t.notThrows(() => {
		doValidate('()');
	}, '()');

	t.notThrows(() => {
		doValidate('a AND b');
	}, 'a AND b');

	t.notThrows(() => {
		doValidate('(a) AND (b)');
	}, '(a) AND (b)');

	t.notThrows(() => {
		doValidate('(a IFF b) AND (b)');
	}, '(a IFF b) AND (b)');

	t.throws(
		() => {
			doValidate('???');
		},
		{
			message: 'Unexpected "???" at (0 - 3).',
			instanceOf: IndexedError,
		},
		'???',
	);

	t.throws(
		() => {
			doValidate(`${LogicalSymbolFromName.and}&`);
		},
		{
			message: `Unexpected "${LogicalSymbolFromName.and}&" at (0 - 2).`,
			instanceOf: IndexedError,
		},
		`${LogicalSymbolFromName.and}&`,
	);

	t.throws(
		() => {
			doValidate(`${LogicalSymbolFromName.and}&&`);
		},
		{
			message: `Unexpected "${LogicalSymbolFromName.and}&&" at (0 - 3).`,
			instanceOf: IndexedError,
		},
		`${LogicalSymbolFromName.and}&`,
	);

	t.throws(
		() => {
			validateCharacters([
				{
					characters: 'ABC',
					from: 0,
					to: 3,
					type: 'abc' as CharacterTypes.bracket,
					source: 'ABC',
				},
			]);
		},
		{
			message: /unexpected.+"abc"/i,
		},
	);

	t.throws(() => {
		validateCharacters([
			{
				characters: 'ABC',
				from: 0,
				to: 3,
				type: CharacterTypes.bracket,
				source: 'ABC',
			},
		]);
	});
});
