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

export const validateEmptyParens = (input: readonly Token[]): void => {
	let last: Token | undefined;

	for (const item of input) {
		if (last?.type === TokenType.parens && item.type === TokenType.parens) {
			if (item.parensType === 'open' && last.parensType === 'close') {
				throw new IndexedError(
					`Unexpected opening parentheses at position ${item.from}.`,
					item.from,
					item.to,
				);
			}

			if (item.parensType === 'close' && last.parensType === 'open') {
				throw new IndexedError(
					`Unexpected empty parentheses at (${last.from} - ${item.to}).`,
					last.from,
					item.to,
				);
			}
		}

		last = item;
	}
};
