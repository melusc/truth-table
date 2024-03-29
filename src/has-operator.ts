import {TokenType, type Token} from './tokenize.js';

export const hasOperator = (input: readonly Token[]): boolean => {
	if (input.length === 1) {
		return true;
	}

	let variableCount = 0;

	for (const item of input) {
		if (item.type === TokenType.operator) {
			return true;
		}

		if (item.type === TokenType.variable) {
			++variableCount;
		}
	}

	return variableCount === 1;
};
