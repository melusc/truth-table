import type {Token} from '../tokenize.js';

import {validateEmptyParens} from './validate-empty-parens.js';
import {validateMatchedParens} from './validate-matched-parens.js';
import {validateNots} from './validate-nots.js';

export const validate = (input: readonly Token[]): void => {
	validateNots(input);
	validateMatchedParens(input);
	validateEmptyParens(input);
};
