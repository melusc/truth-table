import {LogicalSymbolFromName, LogicalSymbolsNames} from './logical-symbols.js';
import {TokenType, type Tokens} from './tokenize.js';

export const singleCharacterNotAliases = [
	'~',
	'!',
	LogicalSymbolFromName.not,
] as const;

// https://en.wikipedia.org/wiki/List_of_logic_symbols
const groupedAliases = [
	[
		LogicalSymbolsNames.iff,
		['⇔', '≡', '<->', '<=>', '=', '==', '===', LogicalSymbolFromName.iff],
	],

	[
		LogicalSymbolsNames.ifthen,
		['⇒', '⊃', '->', '=>', LogicalSymbolFromName.ifthen],
	],

	[LogicalSymbolsNames.not, singleCharacterNotAliases],

	[LogicalSymbolsNames.and, ['&&', '&', LogicalSymbolFromName.and]],

	[
		LogicalSymbolsNames.xor,
		[
			'⊕',
			'⊻',
			'≢',
			'>=<',
			'>-<',
			'!=',
			'!==',
			'~=',
			'<>',
			'^',
			LogicalSymbolFromName.xor,
		],
	],

	[LogicalSymbolsNames.or, ['||', '|', LogicalSymbolFromName.or]],
] as const;

const aliasMap = new Map<string, string>();

for (const [operator, aliases] of groupedAliases) {
	for (const alias of aliases) {
		aliasMap.set(alias.toLowerCase(), operator);
	}

	// Map things like "aNd", "AND", ... to "and"
	aliasMap.set(operator.toLowerCase(), operator);
}

export const normaliseOperators = (input: readonly Tokens[]): Tokens[] => {
	const result: Tokens[] = [];

	for (const item of input) {
		const operatorAlias = aliasMap.get(item.characters.toLowerCase());

		if (
			operatorAlias === undefined
			|| (item.type !== TokenType.operator && item.type !== TokenType.variable)
		) {
			result.push(item);
		} else {
			result.push({
				...item,
				characters: operatorAlias,
				type: TokenType.operator,
			});
		}
	}

	return result;
};
