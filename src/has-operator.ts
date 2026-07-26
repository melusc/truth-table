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

import {TokenType, type Token} from './tokenize.js';

export const hasOperator = (input: readonly Token[]): boolean => {
	if (input.length === 1) {
		return true;
	}

	let variableCount = 0;

	for (const item of input) {
		if (item.type === TokenType.operator) {
			return true;
		}

		if (item.type === TokenType.variable) {
			++variableCount;
		}
	}

	return variableCount === 1;
};
