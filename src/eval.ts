import {type AST} from './parse-operation.js';
import {operations} from './operations.js';
import {operationToString} from './operation-to-string.js';
import {LogicalSymbolsNames} from './logical-symbols.js';

export const evalOperation = (
	operation: AST,
	variables: Record<string, boolean>,
): boolean => {
	const stringified = operationToString(operation);

	let cached = variables[stringified];

	if (cached) {
		return cached;
	}

	switch (operation.type) {
		case 'variable': {
			cached = variables[operation.variable]!;
			break;
		}

		case 'operator': {
			if (operation.operator === LogicalSymbolsNames.not) {
				cached = operations.not(evalOperation(operation.values[0], variables));
			} else {
				cached = operations[operation.operator](
					evalOperation(operation.values[0], variables),
					evalOperation(operation.values[1], variables),
				);
			}

			break;
		}

		default: {
			throw new Error(
				`Unexpected operation.type "${(operation as {type: string})?.type}".`,
			);
		}
	}

	variables[stringified] = cached;
	return cached;
};
