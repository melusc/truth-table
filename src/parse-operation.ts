import type {ReadonlyDeep} from 'type-fest';

import {groupItems} from './group-items.js';
import {hasOperator} from './has-operator.js';
import {IndexedError} from './indexed-error.js';
import {
	LogicalSymbolFromName,
	LogicalSymbolsNames,
	type LogicalName,
} from './logical-symbols.js';
import {normaliseOperators} from './operator-alias.js';
import {splitOperators} from './split-operators.js';
import {TokenType, tokenize, type Tokens} from './tokenize.js';
import {validate} from './validate/validate.js';

export type AST = ReadonlyDeep<
	| {
			type: 'operator';
			operator: Exclude<LogicalName, 'not'>;
			values: [AST, AST];
	  }
	| {
			type: 'operator';
			operator: 'not';
			values: [AST];
	  }
	| {
			type: 'variable';
			variable: string;
	  }
>;

const toOriginalString = (input: Tokens | Tokens[]): string => {
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

const parseNot = (input: readonly Tokens[][]): AST => {
	const first = input[0]?.[0];

	if (first === undefined) {
		throw new Error('Unexpected empty input in parseNot.');
	}

	if (
		first.type !== TokenType.operator
		// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
		|| first.characters !== LogicalSymbolsNames.not
	) {
		throw new IndexedError(
			`Expected "${LogicalSymbolFromName.not}".`,
			first.from,
			first.to,
		);
	}

	return {
		type: 'operator',
		operator: 'not',
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
const parseGroup = (input: Tokens[]): AST => {
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

	// if first bracket belongs to last bracket
	// (if there are even brackets)
	if (grouped.length === 1) {
		const first = input[0]!;
		const last = input.at(-1)!;

		if (first.type === TokenType.bracket && last.type === TokenType.bracket) {
			return parseGroup(input.slice(1, -1));
		}
	}

	return parseOperationInternal(grouped);
};

const parseOperationInternal = (input: Tokens[][]): AST => {
	if (input.length === 0) {
		throw new Error('Unexpected empty input at _parseOperation.');
	}

	if (input.length === 1) {
		return parseGroup(input[0]!);
	}

	const lastItems: Tokens[][] = [input.pop()!];

	let secondToLast: Tokens[] | undefined;
	while (
		(secondToLast = input.at(-1))
		&& secondToLast.length === 1
		&& secondToLast[0]!.type === TokenType.operator
		// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
		&& secondToLast[0]!.characters === LogicalSymbolsNames.not
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

	return {
		type: 'operator',
		operator: operator.characters as Exclude<LogicalName, 'not'>,
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

	const split = splitOperators(tokens);

	const translatedMappings = normaliseOperators(split);

	validate(translatedMappings);

	return parseGroup(translatedMappings);
};
