import {isValidLogicalSymbol} from './logical-symbols.js';
import {singleCharacterNotMappings} from './mappings.js';
import {CharacterTypes, StringWithIndices} from './string-with-indices.js';

const isNot = (input: string): boolean =>
	singleCharacterNotMappings.includes(
		input as typeof singleCharacterNotMappings[number],
	);

export const splitOperators = (
	input: StringWithIndices[],
): StringWithIndices[] => {
	const result: StringWithIndices[] = [];

	for (const item of input) {
		if (item.type !== CharacterTypes.operator) {
			result.push(item);

			continue;
		}

		let previous = '';
		let previousFrom = item.from;

		const push = (to: number): void => {
			if (previous !== '') {
				result.push({
					characters: previous,
					type: CharacterTypes.operator,
					originalCharacters: previous,
					from: previousFrom,
					to,
				});
			}
		};

		for (let i = 0; i < item.characters.length; ++i) {
			const character = item.characters.charAt(i);
			const nextCharacter = item.characters.charAt(i + 1);

			// Incase of !== don't parse it as "not =="
			if (
				(isNot(character) && (nextCharacter === '' || isNot(nextCharacter)))
				|| isValidLogicalSymbol(character)
			) {
				push(item.from + i);

				result.push({
					characters: character,
					type: CharacterTypes.operator,
					originalCharacters: character,
					from: item.from + i,
					to: item.from + i + 1,
				});

				previous &&= '';

				previousFrom = item.from + i + 1;
			} else {
				previous += character;
			}
		}

		push(item.to);
	}

	return result;
};
