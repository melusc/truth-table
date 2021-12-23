import {ReadonlyDeep} from 'type-fest';
import {IndexedError} from './indexed-error.js';
import {LogicalSymbolFromName, LogicalSymbolsNames} from './logical-symbols.js';
import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';

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

export const normaliseOperators = (
	input: ReadonlyDeep<StringWithIndices[]>,
): StringWithIndices[] => {
	const result: StringWithIndices[] = [];

	for (const item of input) {
		const caretOffset = item.characters.indexOf('^');
		if (caretOffset !== -1) {
			// It could be confused with ∧ (logical and) or bitwise xor ^ (caret)
			const caretIndex = item.from + caretOffset;
			throw new IndexedError(
				`Unexpected ambiguous caret (^) at position ${caretIndex}.`,
				caretIndex,
				caretIndex + 1,
			);
		}

		const operatorAlias = aliasMap.get(item.characters.toLowerCase());

		if (
			operatorAlias === undefined
			|| (item.type !== CharacterTypes.operator
				&& item.type !== CharacterTypes.variable)
		) {
			result.push(item);
		} else {
			result.push({
				...item,
				characters: operatorAlias,
				type: CharacterTypes.operator,
			});
		}
	}

	return result;
};
