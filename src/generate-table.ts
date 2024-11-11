import type {Except, ReadonlyDeep} from 'type-fest';

import {evalOperation} from './eval.js';
import {findVariables} from './find-variables.js';
import {generateBoolPermutations} from './generate-bool-permutations.js';
import {operationToString} from './operation-to-string.js';
import {type AST, parseOperation} from './parse-operation.js';

type Column = [AST, string];

function* getColumns(operations: AST, includeSteps: boolean): Iterable<Column> {
	// Not variables, they are handled differently below
	if (operations.type !== 'variable') {
		// If includeSteps === false, only yield the outermost operation
		if (includeSteps) {
			for (const value of operations.values) {
				yield* getColumns(value, includeSteps);
			}
		}

		// Yield after above, so it goes from inside out
		yield [operations, operationToString(operations)];
	}
}

const deduplicateColumns = (columns: Iterable<Column>): Column[] => {
	const seenColumns = new Set<string>();
	const result: Column[] = [];

	for (const column of columns) {
		if (!seenColumns.has(column[1])) {
			result.push(column);
			seenColumns.add(column[1]);
		}
	}

	return result;
};

const removeOuterParens = (string: string): string =>
	string.replace(/^\((.+)\)$/, '$1');

type MutableTable = {
	columns: string[];
	rows: boolean[][];
	ast: AST;
};

type TableReadonlyKeys = 'columns' | 'rows';
export type ParsedTable = ReadonlyDeep<Pick<MutableTable, TableReadonlyKeys>> &
	Readonly<Except<MutableTable, TableReadonlyKeys>>;

export const generateTable = (
	input: string,
	includeSteps = true,
): ParsedTable => {
	const parsed = parseOperation(input);
	const variables = findVariables(parsed);
	const rows = generateBoolPermutations(variables);
	const columns = deduplicateColumns(getColumns(parsed, includeSteps));

	const table: MutableTable = {
		columns: [...variables],
		rows: [],
		ast: parsed,
	};

	for (const [, stringified] of columns) {
		table.columns.push(removeOuterParens(stringified));
	}

	for (const variablePermutations of rows) {
		const row: boolean[] = [];

		for (const variable of variables) {
			row.push(variablePermutations[variable]!);
		}

		for (const [operation] of columns) {
			row.push(evalOperation(operation, variablePermutations));
		}

		table.rows.push(row);
	}

	return table;
};
