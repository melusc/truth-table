import {TokenType, type Tokens} from './tokenize.js';

export const groupItems = (input: readonly Tokens[]): Tokens[][] => {
	let previous: Tokens[] = [];
	const result: Tokens[][] = [];

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

			if (item.characters === '(') {
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
