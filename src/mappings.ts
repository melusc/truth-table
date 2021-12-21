import {ReadonlyDeep} from 'type-fest';
import {IndexedError} from './indexed-error.js';
import {LogicalSymbolFromName, LogicalSymbolsNames} from './logical-symbols.js';
import {CharacterTypes, type StringWithIndices} from './string-with-indices.js';

export const singleCharacterNotMappings = [
	'~',
	'!',
	LogicalSymbolFromName.not,
] as const;

// https://en.wikipedia.org/wiki/List_of_logic_symbols
const stringMappings = [
	[
		LogicalSymbolsNames.iff,
		['⇔', '≡', '<->', '<=>', '=', '==', '===', LogicalSymbolFromName.iff],
	],

	[
		LogicalSymbolsNames.ifthen,
		['⇒', '⊃', '->', '=>', LogicalSymbolFromName.ifthen],
	],

	[LogicalSymbolsNames.not, singleCharacterNotMappings],

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

const mappings = new Map<string, string>();

for (const [operator, operatorAliases] of stringMappings) {
	for (const operatorAlias of operatorAliases) {
		mappings.set(operatorAlias.toLowerCase(), operator);
	}

	// Map things like "aNd", "AND", ... to "and"
	mappings.set(operator.toLowerCase(), operator);
}

export const replaceMappings = (
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

		const operator = mappings.get(item.characters.toLowerCase());

		if (
			operator === undefined
			|| (item.type !== CharacterTypes.operator
				&& item.type !== CharacterTypes.variable)
		) {
			result.push(item);
		} else {
			result.push({
				...item,
				originalCharacters: item.characters,
				characters: operator,
				type: CharacterTypes.operator,
			});
		}
	}

	return result;
};
