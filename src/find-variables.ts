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

const variableSorter = Intl.Collator('en', {
	sensitivity: 'base',
});

export const findVariables = (
	operation: AST,
	sortVariables: boolean,
): ReadonlySet<string> => {
	const result = new Set<string>(findVariablesRecursive(operation));

	if (!sortVariables) {
		return result;
	}

	return new Set([...result].toSorted((a, b) => variableSorter.compare(a, b)));
};
