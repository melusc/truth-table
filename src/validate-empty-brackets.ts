import {IndexedError} from './indexed-error.js';
import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';

export const validateEmptyBrackets = (
	input: readonly StringWithIndices[],
): void => {
	let last: StringWithIndices | undefined;

	for (const item of input) {
		if (
			last?.type === CharacterTypes.bracket
			&& item.type === CharacterTypes.bracket
		) {
			if (item.characters === '(' && last.characters === ')') {
				throw new IndexedError(
					`Unexpected opening bracket at position ${item.from}.`,
					item.from,
					item.to,
				);
			} else if (item.characters === ')' && last.characters === '(') {
				throw new IndexedError(
					`Unexpected empty brackets at (${last.from} - ${item.to}).`,
					last.from,
					item.to,
				);
			}
		}

		last = item;
	}
};
