import {singleCharacterNotAliases} from './operator-alias.js';
import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';
import {logicalSymbols} from './logical-symbols.js';

const joinedNots = `[${singleCharacterNotAliases.join('')}]`;
const joinedSymbols = `[${logicalSymbols.join('')}]`;
const splitter = new RegExp(
	// not-symbol where next character is also not-symbol or end of string, to not match stuff like `!==`
	`(${joinedNots}(?=${joinedNots}|$)|${joinedSymbols})`,
);

export const splitOperators = (
	input: readonly StringWithIndices[],
): StringWithIndices[] => {
	const result: StringWithIndices[] = [];

	for (const item of input) {
		if (item.type !== CharacterTypes.operator) {
			result.push(item);

			continue;
		}

		const split = item.characters.split(splitter);
		let index = item.from;

		for (const characters of split) {
			if (characters === '') {
				continue;
			}

			result.push({
				characters,
				type: CharacterTypes.operator,
				from: index,
				to: index + characters.length,
				source: item.source,
			});

			index += characters.length;
		}
	}

	return result;
};
