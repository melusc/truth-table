import type {Token} from '../tokenize.js';

import {validateMatchedBrackets} from './validate-matched-brackets.js';
import {validateEmptyBrackets} from './validate-empty-brackets.js';
import {validateNots} from './validate-nots.js';

export const validate = (input: readonly Token[]): void => {
	validateNots(input);
	validateMatchedBrackets(input);
	validateEmptyBrackets(input);
};
