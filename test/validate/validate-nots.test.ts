import assert from 'node:assert/strict';
import test from 'node:test';

import {OperatorSymbols} from '../../src/operators.js';
import {tokenize} from '../../src/tokenize.js';
import {validateNots} from '../../src/validate/validate-nots.js';

const doValidate = (input: string): void => {
	validateNots(tokenize(input));
};

await test('validateNots', () => {
	assert.doesNotThrow(() => {
		doValidate(`a${OperatorSymbols.and}${OperatorSymbols.not.repeat(2)}b`);
	});

	assert.throws(
		() => {
			doValidate(`a ${OperatorSymbols.not} && b`);
		},
		{
			message: 'Unexpected operator "&&".',
			from: 4,
			to: 6,
			name: 'IndexedError',
		},
	);

	assert.throws(
		() => {
			doValidate(`a ${OperatorSymbols.not} & !b`);
		},
		{
			message: 'Unexpected operator "&".',
			from: 4,
			to: 5,
			name: 'IndexedError',
		},
	);
});
