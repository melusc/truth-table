import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';

export const groupItems = (
	input: StringWithIndices[],
): StringWithIndices[][] => {
	let previous: StringWithIndices[] = [];
	const result: StringWithIndices[][] = [];

	let depth = 0;

	const pushResult = () => {
		if (previous.length > 0 && depth === 0) {
			result.push(previous);
			previous = [];
		}
	};

	for (const item of input) {
		if (item.type === CharacterTypes.bracket) {
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
