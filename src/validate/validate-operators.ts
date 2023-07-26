import {LogicalSymbolsNames} from '../logical-symbols.js';
import {TokenType, type Tokens} from '../tokenize.js';
import {IndexedError} from '../indexed-error.js';

export const validateOperators = (input: readonly Tokens[]): void => {
	let lastType: TokenType | undefined;

	for (const item of input) {
		if (
			item.type === TokenType.operator
			&& lastType === TokenType.operator
			// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
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
