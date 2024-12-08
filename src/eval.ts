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
