import {LogicalSymbolsNames} from './logical-symbols.js';
import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';
import {IndexedError} from './indexed-error.js';

export const validateOperators = (
	input: readonly StringWithIndices[],
): void => {
	let lastType: CharacterTypes | undefined;

	for (const item of input) {
		if (
			item.type === CharacterTypes.operator
			&& lastType === CharacterTypes.operator
			&& item.characters !== LogicalSymbolsNames.not
		) {
			throw new IndexedError(
				`Unexpected operator "${item.source.slice(item.from, item.to)}" at (${
					item.from
				} - ${item.to}).`,
				item.from,
				item.to,
			);
		}

		lastType = item.type;
	}
};
