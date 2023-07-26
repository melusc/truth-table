import {IndexedError} from '../indexed-error.js';
import {TokenType, type Token} from '../tokenize.js';

export const validateEmptyBrackets = (input: readonly Token[]): void => {
	let last: Token | undefined;

	for (const item of input) {
		if (last?.type === TokenType.bracket && item.type === TokenType.bracket) {
			if (item.bracketType === 'open' && last.bracketType === 'close') {
				throw new IndexedError(
					`Unexpected opening bracket at position ${item.from}.`,
					item.from,
					item.to,
				);
			} else if (item.bracketType === 'close' && last.bracketType === 'open') {
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
