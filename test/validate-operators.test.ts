import test from 'ava';
import {IndexedError} from '../src/indexed-error.js';
import {LogicalSymbolFromName} from '../src/logical-symbols.js';
import {replaceMappings} from '../src/mappings.js';
import {splitOperators} from '../src/split-operators.js';
import {fromString} from '../src/string-with-indices.js';

import {validateOperators} from '../src/validate-operators.js';

const doValidate = (input: string): void => {
	validateOperators(replaceMappings(splitOperators(fromString(input))));
};

test('validateOperators', t => {
	t.notThrows(() => {
		doValidate(
			`a${LogicalSymbolFromName.and}${LogicalSymbolFromName.not.repeat(2)}b`,
		);
	}, `a${LogicalSymbolFromName.and}${LogicalSymbolFromName.not.repeat(2)}b`);

	t.throws(
		() => {
			doValidate(`a ${LogicalSymbolFromName.not} && b`);
		},
		{
			message: 'Unexpected operator "&&" at (4 - 6).',
			instanceOf: IndexedError,
		},
		`a ${LogicalSymbolFromName.not} && b`,
	);

	t.throws(
		() => {
			doValidate(`a ${LogicalSymbolFromName.not} & b`);
		},
		{
			message: 'Unexpected operator "&" at (4 - 5).',
			instanceOf: IndexedError,
		},
		`a ${LogicalSymbolFromName.not} & b`,
	);

	t.throws(
		() => {
			doValidate(`a ${LogicalSymbolFromName.and.repeat(2)} b`);
		},
		{
			message: `Unexpected operator "${LogicalSymbolFromName.and}" at (3 - 4).`,
			instanceOf: IndexedError,
		},
		`a${LogicalSymbolFromName.and.repeat(2)}b`,
	);
});
