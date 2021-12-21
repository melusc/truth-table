import {CharacterTypes, StringWithIndices} from './string-with-indices.js';

export const groupItems = (
	input: StringWithIndices[],
): StringWithIndices[][] => {
	let previous: StringWithIndices[] = [];
	const result: StringWithIndices[][] = [];

	let openBrackets = 0;

	// Expect it to be validated with validate-matched-brackets.ts

	const pushToResult = (): void => {
		if (previous.length > 0 && openBrackets === 0) {
			result.push(previous);
			previous = [];
		}
	};

	for (const item of input) {
		if (item.type === CharacterTypes.bracket) {
			pushToResult();
		}

		previous.push(item);

		if (item.type === CharacterTypes.bracket) {
			const l = item.characters.length;

			if (item.characters.startsWith('(')) {
				openBrackets += l;
			} else {
				openBrackets -= l;
			}
		} else if (item.type === CharacterTypes.operator && openBrackets === 0) {
			previous.pop();
			pushToResult();
			result.push([item]);
		}

		if (item.type === CharacterTypes.bracket) {
			pushToResult();
		}
	}

	pushToResult();

	return result;
};
