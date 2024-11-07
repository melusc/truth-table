import {Operator} from '../operators.js';
import {TokenType, type Token} from '../tokenize.js';
import {IndexedError} from '../indexed-error.js';

export const validateNots = (input: readonly Token[]): void => {
	let lastType: TokenType | undefined;

	for (const item of input) {
		if (
			item.type === TokenType.operator &&
			lastType === TokenType.operator &&
			item.operator !== Operator.not
		) {
			throw new IndexedError(
				`Unexpected operator "${item.source.slice(item.from, item.to)}".`,
				item.from,
				item.to,
			);
		}

		lastType = item.type;
	}
};
