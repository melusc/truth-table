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

import {OperatorSymbols, Operator} from './operators.js';
import type {AST} from './parse-operation.js';

const cache = new WeakMap<AST, string>();

export const operationToString = (operation: AST): string => {
	if (cache.has(operation)) {
		return cache.get(operation)!;
	}

	let stringified: string;

	if (operation.type === 'variable') {
		stringified = operation.variable;
	} else if (operation.operator === Operator.not) {
		stringified = `${OperatorSymbols.not}${operationToString(
			operation.values[0],
		)}`;
	} else {
		stringified = `(${operationToString(operation.values[0])} ${
			OperatorSymbols[operation.operator]
		} ${operationToString(operation.values[1])})`;
	}

	cache.set(operation, stringified);
	return stringified;
};
