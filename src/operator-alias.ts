/*!
 * This file is part of @lusc/truth-table, a logic parser and table generator.
 * Copyright (C) 2026, Luca Schnellmann <oss@lusc.ch>

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
		['⇔', '≡', '<->', '<=>', '=', '==', '===', 'xnor', OperatorSymbols.iff],
	],

	[
		Operator.ifthen,
		['⇒', '⊃', '->', '=>', '|=', '⊧', '|-', '⊦', '⟝', OperatorSymbols.ifthen],
	],

	[Operator.not, singleCharacterNotAliases],

	[Operator.and, ['&&', '&', '*', OperatorSymbols.and]],

	[Operator.nand, ['!&', '!&&', '~&', '~&&', OperatorSymbols.nand]],

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

	[Operator.or, ['||', '|', '+', OperatorSymbols.or]],

	[Operator.nor, ['!|', '!||', '~|', '~||', OperatorSymbols.nor]],
] as const;

export const operatorAliases = new Map<string, Operator>();

for (const [operator, aliases] of groupedAliases) {
	for (const alias of aliases) {
		operatorAliases.set(alias.toLowerCase(), operator);
	}

	// Map things like "aNd", "AND", ... to "and"
	operatorAliases.set(operator.toLowerCase(), operator);
}
