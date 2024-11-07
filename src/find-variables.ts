import type {AST} from './parse-operation.js';

function* findVariablesRecursive(operation: AST): Iterable<string> {
	if (operation.type === 'variable') {
		yield operation.variable;
	} else {
		for (const value of operation.values) {
			yield* findVariablesRecursive(value);
		}
	}
}

export const findVariables = (operation: AST): ReadonlySet<string> =>
	new Set<string>(findVariablesRecursive(operation));
