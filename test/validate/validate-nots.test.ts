import test from 'ava';

import {IndexedError} from '../../src/indexed-error.js';
import {OperatorSymbols} from '../../src/operators.js';
import {tokenize} from '../../src/tokenize.js';
import {validateNots} from '../../src/validate/validate-nots.js';

const doValidate = (input: string): void => {
	validateNots(tokenize(input));
};

test('validateNots', t => {
	t.notThrows(
		() => {
			doValidate(`a${OperatorSymbols.and}${OperatorSymbols.not.repeat(2)}b`);
		},
		`a${OperatorSymbols.and}${OperatorSymbols.not.repeat(2)}b`,
	);

	t.throws(
		() => {
			doValidate(`a ${OperatorSymbols.not} && b`);
		},
		{
			message: 'Unexpected operator "&&".',
			instanceOf: IndexedError,
		},
		`a ${OperatorSymbols.not} && b`,
	);

	t.throws(
		() => {
			doValidate(`a ${OperatorSymbols.not} & !b`);
		},
		{
			message: 'Unexpected operator "&".',
			instanceOf: IndexedError,
		},
		`a ${OperatorSymbols.not} & !b`,
	);
});
