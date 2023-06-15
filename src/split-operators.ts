import {singleCharacterNotAliases} from './operator-alias.js';
import {TokenType, type Tokens} from './tokenize.js';
import {logicalSymbols} from './logical-symbols.js';

const joinedNots = `[${singleCharacterNotAliases.join('')}]`;
const joinedSymbols = `[${logicalSymbols.join('')}]`;
const splitter = new RegExp(
	// not-symbol where next character is also not-symbol or end of string, to not match stuff like `!==`
	`(${joinedNots}(?=${joinedNots}|$)|${joinedSymbols})`,
);

export const splitOperators = (input: readonly Tokens[]): Tokens[] => {
	const result: Tokens[] = [];

	for (const item of input) {
		if (item.type !== TokenType.operator) {
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
				type: TokenType.operator,
				from: index,
				to: index + characters.length,
				source: item.source,
			});

			index += characters.length;
		}
	}

	return result;
};
