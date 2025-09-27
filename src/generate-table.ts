import {evalOperation} from './eval.js';
import {findVariables} from './find-variables.js';
import {generateBoolPermutations} from './generate-bool-permutations.js';
import {operationToString} from './operation-to-string.js';
import {type AST, parseOperation} from './parse-operation.js';

type Column = readonly [AST, string];

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

const deduplicateColumns = (columns: Iterable<Column>): readonly Column[] => {
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
		const row: boolean[] = [];

		for (const variable of variables) {
			row.push(variablePermutations[variable]!);
		}

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
