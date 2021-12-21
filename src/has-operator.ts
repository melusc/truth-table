import {CharacterTypes, StringWithIndices} from './string-with-indices.js';

export const hasOperator = (input: StringWithIndices[]): boolean => {
	if (input.length === 1) {
		return true;
	}

	let variableCount = 0;

	for (const item of input) {
		if (item.type === CharacterTypes.operator) {
			return true;
		}

		if (item.type === CharacterTypes.variable) {
			++variableCount;
		}
	}

	return variableCount === 1;
};
