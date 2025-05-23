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
