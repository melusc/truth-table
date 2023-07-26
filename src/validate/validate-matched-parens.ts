import {IndexedError} from '../indexed-error.js';
import {TokenType, type Token} from '../tokenize.js';

export const validateMatchedParens = (input: readonly Token[]): void => {
	// Push for opening parens
	// pop on closing parens
	// Expect it to always have an index at end for every closing parens
	// Expect it to not have any leftover opening parens after all
	const openingParens: number[] = [];

	for (const item of input) {
		if (item.type === TokenType.parens) {
			if (item.parensType === 'open') {
				openingParens.push(item.from);
			} else if (openingParens.pop() === undefined) {
				// If there is no matched parens
				throw new IndexedError(
					`Unmatched parenthesis at position ${item.from}.`,
					item.from,
					item.from + 1,
				);
			}
		}
	}

	const last = openingParens.pop();
	if (last !== undefined) {
		throw new IndexedError(
			`Unmatched parenthesis at position ${last}.`,
			last,
			last + 1,
		);
	}
};
