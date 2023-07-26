import {type AST} from './parse-operation.js';
import {LogicalSymbolFromName} from './logical-symbols.js';

const cache = new Map<AST, string>();

export const operationToString = (operation: AST): string => {
	if (cache.has(operation)) {
		return cache.get(operation)!;
	}

	let stringified: string;

	if (operation.type === 'variable') {
		stringified = operation.variable;
	} else if (operation.operator === 'not') {
		stringified = `${LogicalSymbolFromName.not}${operationToString(
			operation.values[0],
		)}`;
	} else {
		stringified = `(${operationToString(operation.values[0])} ${
			LogicalSymbolFromName[operation.operator]
		} ${operationToString(operation.values[1])})`;
	}

	cache.set(operation, stringified);
	return stringified;
};
