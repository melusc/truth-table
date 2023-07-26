import {Operator, OperatorSymbols} from './operators.js';

export const singleCharacterNotAliases = new Set([
	'~',
	'!',
	OperatorSymbols.not,
]);

// https://en.wikipedia.org/wiki/List_of_logic_symbols
const groupedAliases = [
	[
		Operator.iff,
		['⇔', '≡', '<->', '<=>', '=', '==', '===', OperatorSymbols.iff],
	],

	[Operator.ifthen, ['⇒', '⊃', '->', '=>', OperatorSymbols.ifthen]],

	[Operator.not, singleCharacterNotAliases],

	[Operator.and, ['&&', '&', OperatorSymbols.and]],

	[
		Operator.xor,
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
			OperatorSymbols.xor,
		],
	],

	[Operator.or, ['||', '|', OperatorSymbols.or]],
] as const;

export const operatorAliases = new Map<string, Operator>();

for (const [operator, aliases] of groupedAliases) {
	for (const alias of aliases) {
		operatorAliases.set(alias.toLowerCase(), operator);
	}

	// Map things like "aNd", "AND", ... to "and"
	operatorAliases.set(operator.toLowerCase(), operator);
}
