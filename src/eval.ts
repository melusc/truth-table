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

import {operationToString} from './operation-to-string.js';
import {Operator} from './operators.js';
import type {AST} from './parse-operation.js';

export const operations = {
	iff: (a: boolean, b: boolean) => a === b,
	ifthen: (a: boolean, b: boolean) => !a || b,
	not: (a: boolean) => !a,
	and: (a: boolean, b: boolean) => a && b,
	nand: (a: boolean, b: boolean) => !(a && b),
	xor: (a: boolean, b: boolean) => (a ? !b : b),
	or: (a: boolean, b: boolean) => a || b,
	nor: (a: boolean, b: boolean) => !(a || b),
} as const;

export const evalOperation = (
	operation: AST,
	variables: Record<string, boolean>,
): boolean => {
	const stringified = operationToString(operation);

	let cached = variables[stringified];

	if (cached !== undefined) {
		return cached;
	}

	switch (operation.type) {
		case 'variable': {
			cached = variables[operation.variable]!;
			break;
		}

		case 'operator': {
			cached =
				operation.operator === Operator.not
					? operations.not(evalOperation(operation.values[0], variables))
					: operations[operation.operator](
							evalOperation(operation.values[0], variables),
							evalOperation(operation.values[1], variables),
						);

			break;
		}

		default: {
			throw new Error(
				`Unexpected operation.type "${(operation as {type: string}).type}".`,
			);
		}
	}

	variables[stringified] = cached;
	return cached;
};
