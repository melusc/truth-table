import {IndexedError} from '../indexed-error.js';
import {TokenType, type Tokens} from '../tokenize.js';

export const validateEmptyBrackets = (input: readonly Tokens[]): void => {
	let last: Tokens | undefined;

	for (const item of input) {
		if (last?.type === TokenType.bracket && item.type === TokenType.bracket) {
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
