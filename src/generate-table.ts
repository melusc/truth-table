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

import {evalOperation} from './eval.js';
import {findVariables} from './find-variables.js';
import {generateBoolPermutations} from './generate-bool-permutations.js';
import {operationToString} from './operation-to-string.js';
import {type AST, parseOperation} from './parse-operation.js';

type Column = readonly [AST, string];

function* getColumns(operations: AST, includeSteps: boolean): Iterable<Column> {
	// Not variables, they are handled differently below
	if (operations.type === 'variable') {
		return;
	}

	// If includeSteps === false, only yield the outermost operation
	if (includeSteps) {
		for (const value of operations.values) {
			yield* getColumns(value, includeSteps);
		}
	}

	// Yield after above, so it goes from inside out
	yield [operations, operationToString(operations)];
}

const deduplicateColumns = (columns: Iterable<Column>): readonly Column[] => {
	const seenColumns = new Set<string>();
	const result: Column[] = [];

	for (const column of columns) {
		if (seenColumns.has(column[1])) {
			continue;
		}

		result.push(column);
		seenColumns.add(column[1]);
	}

	return result;
};

const removeOuterParens = (string: string): string =>
	string.replace(/^\((.+)\)$/, '$1');

export type ParsedTable = {
	readonly columns: readonly string[];
	readonly rows: readonly (readonly boolean[])[];
	readonly ast: AST;
};

export type GenerateTableOptions = {
	includeSteps?: boolean;
	sortVariables?: boolean;
};

export const generateTable = (
	input: string,
	options?: GenerateTableOptions,
): ParsedTable => {
	// Default true
	const includeSteps = options?.includeSteps !== false;
	// Default true
	const sortVariables = options?.sortVariables !== false;

	const parsed = parseOperation(input);
	const variables = findVariables(parsed, sortVariables);
	const rows = generateBoolPermutations(variables);
	const columns = deduplicateColumns(getColumns(parsed, includeSteps));

	const tableColumns = [...variables];
	const tableRows: boolean[][] = [];

	for (const [, stringified] of columns) {
		tableColumns.push(removeOuterParens(stringified));
	}

	for (const variablePermutations of rows) {
		const row = Array.from(
			variables,
			variable => variablePermutations[variable]!,
		);

		for (const [operation] of columns) {
			row.push(evalOperation(operation, variablePermutations));
		}

		tableRows.push(row);
	}

	return {
		columns: tableColumns,
		rows: tableRows,
		ast: parsed,
	};
};
