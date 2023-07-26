import {IndexedError} from '../indexed-error.js';
import {TokenType, type Token} from '../tokenize.js';

export const validateMatchedBrackets = (input: readonly Token[]): void => {
	// Push for opening bracket
	// pop on closing bracket
	// Expect it to always have an index at end for every closing bracket
	// Expect it to not have any leftover opening brackets after all
	const openingBrackets: number[] = [];

	for (const item of input) {
		if (item.type === TokenType.bracket) {
			if (item.bracketType === 'open') {
				openingBrackets.push(item.from);
			} else if (openingBrackets.pop() === undefined) {
				// If there is no matched bracket
				throw new IndexedError(
					`Unmatched bracket at position ${item.from}.`,
					item.from,
					item.from + 1,
				);
			}
		}
	}

	const last = openingBrackets.pop();
	if (last !== undefined) {
		throw new IndexedError(
			`Unmatched bracket at position ${last}.`,
			last,
			last + 1,
		);
	}
};
