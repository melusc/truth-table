import {TokenType, type Token} from './tokenize.js';

export const groupItems = (input: readonly Token[]): Token[][] => {
	let previous: Token[] = [];
	const result: Token[][] = [];

	let depth = 0;

	const pushResult = () => {
		if (previous.length > 0 && depth === 0) {
			result.push(previous);
			previous = [];
		}
	};

	for (const item of input) {
		if (item.type === TokenType.bracket) {
			pushResult();

			previous.push(item);

			if (item.bracketType === 'open') {
				++depth;
			} else {
				--depth;
			}

			pushResult();
		} else if (depth === 0) {
			result.push([item]);
		} else {
			previous.push(item);
		}
	}

	pushResult();

	return result;
};
