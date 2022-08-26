import {LogicalSymbolsNames} from './logical-symbols.js';
import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';
import {IndexedError} from './indexed-error.js';

export const validateOperators = (input: StringWithIndices[]): void => {
	let lastType: CharacterTypes | undefined;

	for (const item of input) {
		if (item.type === CharacterTypes.space) {
			continue;
		}

		if (
			item.type === CharacterTypes.operator
			&& lastType === CharacterTypes.operator
			&& item.characters !== LogicalSymbolsNames.not
		) {
			throw new IndexedError(
				`Unexpected operator "${item.originalCharacters}" at (${item.from} - ${item.to}).`,
				item.from,
				item.to,
			);
		}

		lastType = item.type;
	}
};
