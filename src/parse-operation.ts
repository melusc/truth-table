import type {ReadonlyDeep} from 'type-fest';

import {groupItems} from './group-items.js';
import {hasOperator} from './has-operator.js';
import {IndexedError} from './indexed-error.js';
import {OperatorSymbols, Operator} from './operators.js';
import {TokenType, tokenize, type Token} from './tokenize.js';
import {validate} from './validate/validate.js';

export type AST = ReadonlyDeep<
	| {
			type: 'operator';
			operator: Exclude<Operator, Operator.not>;
			values: [AST, AST];
	  }
	| {
			type: 'operator';
			operator: Operator.not;
			values: [AST];
	  }
	| {
			type: 'variable';
			variable: string;
	  }
>;

const toOriginalString = (input: Token | Token[]): string => {
	if (!Array.isArray(input)) {
		return input.source.slice(input.from, input.to);
	}

	const [first] = input;
	const last = input.at(-1);
	if (!first || !last) {
		throw new Error('Unexpected empty input.');
	}

	return first.source.slice(first.from, last.to);
};

const parseNot = (input: readonly Token[][]): AST => {
	const first = input[0]?.[0];

	if (first === undefined) {
		throw new Error('Unexpected empty input in parseNot.');
	}

	if (first.type !== TokenType.operator || first.operator !== Operator.not) {
		throw new IndexedError(
			`Expected "${OperatorSymbols.not}".`,
			first.from,
			first.to,
		);
	}

	return {
		type: 'operator',
		operator: Operator.not,
		values: [parseOperationInternal(input.slice(1))],
	};
};

/**
 * Handle statements, where grouping it leaves one group
 * @example
 *   `"((a and b))"` ->
 *      This is one group because of the parens
 *      It unwraps the parens until it `"a and b"` is left and passes that to parseOperationInternal
 *
 *   `"a"` -> This is just a variable, so it returns the appropriate AST
 */
const parseGroup = (input: Token[]): AST => {
	if (input.length === 0) {
		throw new Error('Unexpected empty input at _parseOperation.');
	}

	if (!hasOperator(input)) {
		throw new IndexedError(
			`Expected "${toOriginalString(input)}" to have an operator.`,
			input[0]!.from,
			input.at(-1)!.to,
		);
	}

	if (input.length === 1) {
		const item = input[0]!;

		if (item.type === TokenType.variable) {
			return {
				type: 'variable',
				variable: item.characters,
			};
		}

		throw new IndexedError(
			`Unexpected type "${item.type}" at ${item.from}.`,
			item.from,
			item.to,
		);
	}

	const grouped = groupItems(input);

	// if first parens belongs to last parens
	// (if there are even parens)
	if (grouped.length === 1) {
		const first = input[0]!;
		const last = input.at(-1)!;

		if (first.type === TokenType.parens && last.type === TokenType.parens) {
			return parseGroup(input.slice(1, -1));
		}
	}

	return parseOperationInternal(grouped);
};

const parseOperationInternal = (input: Token[][]): AST => {
	if (input.length === 0) {
		throw new Error('Unexpected empty input at _parseOperation.');
	}

	if (input.length === 1) {
		return parseGroup(input[0]!);
	}

	const lastItems: Token[][] = [input.pop()!];

	let secondToLast: Token[] | undefined;
	while (
		(secondToLast = input.at(-1)) &&
		secondToLast.length === 1 &&
		secondToLast[0]!.type === TokenType.operator &&
		secondToLast[0]!.operator === Operator.not
	) {
		lastItems.unshift(input.pop()!);
	}

	if (input.length === 0) {
		return parseNot(lastItems);
	}

	const operatorArray = input.pop()!;
	const operator = operatorArray[0]!;

	if (operatorArray.length !== 1) {
		throw new IndexedError(
			`Expected operator, got "${toOriginalString(operatorArray)}".`,
			operatorArray[0]!.from,
			operatorArray.at(-1)!.to,
		);
	}

	if (operator.type !== TokenType.operator) {
		throw new IndexedError(
			`Expected operator, got type "${
				operator.type
			}" with value "${toOriginalString(operator)}"`,
			operator.from,
			operator.to,
		);
	}

	if (operator.operator === Operator.not) {
		throw new IndexedError(
			`Unexpected "${toOriginalString(operator)}".`,
			operator.from,
			operator.to,
		);
	}

	return {
		type: 'operator',
		operator: operator.operator,
		values: [parseOperationInternal(input), parseOperationInternal(lastItems)],
	};
};

// This is a wrapper, so that it only gets validated once
// and so the internal function is not leaked, and only strings can be passed
/**
 * Given a string, this function parses that string,
 * generating the AST representation of that string.
 */
export const parseOperation = (raw: string): AST => {
	const tokens = tokenize(raw);

	if (tokens.length === 0) {
		throw new Error('Unexpected empty string');
	}

	validate(tokens);

	return parseGroup(tokens);
};
