import {IndexedError} from './indexed-error.js';
import {isValidOperatorName} from './logical-symbols.js';
import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';

const throwUnexpectedChar = (char: string, from: number, to?: number): void => {
	const message
		= to === undefined || to - from === 1
			? `Unexpected character "${char}" at position ${from}.`
			: `Unexpected "${char}" at (${from} - ${to}).`;

	throw new IndexedError(message, from, to ?? from + char.length);
};

const findUnexpectedChar = (input: string, regex: RegExp): void => {
	const index = input.search(regex);

	if (index !== -1) {
		throwUnexpectedChar(input.charAt(index), index);
	}
};

export const validateCharacters = (input: StringWithIndices[]): void => {
	for (const item of input) {
		const c = item.characters;

		// Idk how this could happen, it shouldn't
		if (c.length === 0) {
			throw new IndexedError('Unexpected empty item', item.from, item.to);
		}

		switch (item.type) {
			case CharacterTypes.operator: {
				const validOperator = isValidOperatorName(c);

				if (!validOperator) {
					// c is like "???"
					throwUnexpectedChar(c, item.from, item.to);
				}

				break;
			}

			case CharacterTypes.bracket: {
				findUnexpectedChar(c, /[^()]/);

				break;
			}

			case CharacterTypes.variable: {
				findUnexpectedChar(c, /[^a-z_]/i);

				break;
			}

			default: {
				throw new Error(`Unexpected item-type "${item.type as string}".`);
			}
		}
	}
};
