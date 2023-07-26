import type {Tokens} from '../tokenize.js';

import {validateMatchedBrackets} from './validate-matched-brackets.js';
import {validateCharacters} from './validate-characters.js';
import {validateEmptyBrackets} from './validate-empty-brackets.js';
import {validateOperators} from './validate-operators.js';

export const validate = (input: readonly Tokens[]): void => {
	validateCharacters(input);
	validateOperators(input);
	validateMatchedBrackets(input);
	validateEmptyBrackets(input);
};
