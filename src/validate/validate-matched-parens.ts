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

import {IndexedError} from '../indexed-error.js';
import {TokenType, type Token} from '../tokenize.js';

export const validateMatchedParens = (input: readonly Token[]): void => {
	// Push for opening parens
	// pop on closing parens
	// Expect it to always have an index at end for every closing parens
	// Expect it to not have any leftover opening parens after all
	const openingParens: number[] = [];

	for (const item of input) {
		if (item.type === TokenType.parens) {
			if (item.parensType === 'open') {
				openingParens.push(item.from);
			} else if (openingParens.pop() === undefined) {
				// If there is no matched parens
				throw new IndexedError(
					`Unmatched parenthesis at position ${item.from}.`,
					item.from,
					item.from + 1,
				);
			}
		}
	}

	const last = openingParens.pop();
	if (last !== undefined) {
		throw new IndexedError(
			`Unmatched parenthesis at position ${last}.`,
			last,
			last + 1,
		);
	}
};
