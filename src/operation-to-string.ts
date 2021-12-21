import {type AST} from './parse-operation.js';
import {LogicalSymbolFromName} from './logical-symbols.js';

export const operationToString = (operation: AST): string => {
	let stringified = operation.stringified;

	if (stringified) {
		return stringified;
	}

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

	operation.stringified = stringified;
	return stringified;
};
