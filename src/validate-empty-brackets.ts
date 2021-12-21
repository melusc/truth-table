import {IndexedError} from './indexed-error.js';
import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';

export const validateEmptyBrackets = (input: StringWithIndices[]): void => {
	let between = 0;
	let startBracketIndex = 0;

	for (const item of input) {
		if (item.type === CharacterTypes.space) {
			continue;
		}

		if (item.type !== CharacterTypes.bracket) {
			++between;
			continue;
		}

		const c = item.characters;
		if (c.startsWith('(')) {
			const index = c.search(/\)/);

			if (index !== -1) {
				const offsetIndex = index + item.from;

				throw new IndexedError(
					`Unexpected empty brackets at (${offsetIndex - 1} - ${offsetIndex}).`,
					offsetIndex - 1,
					offsetIndex,
				);
			}

			startBracketIndex = item.to - 1;
		} else {
			const index = c.search(/\(/);

			const offsetIndex = index + item.from;

			// More important: things like "(())()"
			//                                 ^^
			if (index !== -1) {
				throw new IndexedError(
					`Unexpected opening bracket at position ${offsetIndex}.`,
					offsetIndex,
					offsetIndex + 1,
				);
			}

			// Then throw on things like "()" or "(    )"
			if (between === 0) {
				throw new IndexedError(
					`Unexpected empty brackets at (${startBracketIndex} - ${item.from}).`,
					startBracketIndex,
					item.from,
				);
			}
		}
	}
};
