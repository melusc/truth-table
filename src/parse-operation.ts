import type {ReadonlyDeep} from 'type-fest';

import {groupItems} from './group-items.js';
import {normaliseOperators} from './operator-alias.js';
import {
	type LogicalName,
	LogicalSymbolFromName,
	isValidOperatorName,
	LogicalSymbolsNames,
} from './logical-symbols.js';
import {TokenType, tokenize, type Tokens} from './tokenize.js';
import {validate} from './validate.js';
import {splitOperators} from './split-operators.js';
import {hasOperator} from './has-operator.js';
import {IndexedError} from './indexed-error.js';

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
> & {
	stringified?: string;
};

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
		values: [_parseOperations(input.slice(1))],
	};
};

const _parseOperation = (input: Tokens[]): AST => {
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
			return _parseOperation(input.slice(1, -1));
		}
	}

	return _parseOperations(grouped);
};

const _parseOperations = (input: Tokens[][]): AST => {
	if (input.length === 0) {
		throw new Error('Unexpected empty input at _parseOperation.');
	}

	if (input.length === 1) {
		return _parseOperation(input[0]!);
	}

	const lastItems: Tokens[][] = [input.pop()!];

	let secondToLast: Tokens[] | undefined;
	while (
		(secondToLast = input.at(-1))
		&& secondToLast.length === 1
		&& secondToLast[0]!.type === TokenType.operator
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

	// !isValidOperator is unnecessary, it's just a typeguard
	if (
		operator.type !== TokenType.operator
		|| !isValidOperatorName(operator.characters)
	) {
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
		values: [_parseOperations(input), _parseOperations(lastItems)],
	};
};

// Wrapper around _parseOperation for sanitising and validating
// so it doesn't waste resources validating multiple times
export const parseOperation = (raw: string): AST => {
	const tokens = tokenize(raw);

	if (tokens.length === 0) {
		throw new Error('Unexpected empty string');
	}

	const split = splitOperators(tokens);

	const translatedMappings = normaliseOperators(split);

	validate(translatedMappings);

	return _parseOperation(translatedMappings);
};
