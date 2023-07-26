import {IndexedError} from '../indexed-error.js';
import {TokenType, type Token} from '../tokenize.js';

export const validateEmptyParens = (input: readonly Token[]): void => {
	let last: Token | undefined;

	for (const item of input) {
		if (last?.type === TokenType.parens && item.type === TokenType.parens) {
			if (item.parensType === 'open' && last.parensType === 'close') {
				throw new IndexedError(
					`Unexpected opening parentheses at position ${item.from}.`,
					item.from,
					item.to,
				);
			} else if (item.parensType === 'close' && last.parensType === 'open') {
				throw new IndexedError(
					`Unexpected empty parentheses at (${last.from} - ${item.to}).`,
					last.from,
					item.to,
				);
			}
		}

		last = item;
	}
};
