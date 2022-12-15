import {groupItems} from './group-items.js';
import {normaliseOperators} from './operator-alias.js';
import {
	type LogicalName,
	LogicalSymbolFromName,
	isValidOperatorName,
	LogicalSymbolsNames,
} from './logical-symbols.js';
import {
	CharacterTypes,
	fromString,
	type StringWithIndices,
} from './string-with-indices.js';
import {validate} from './validate.js';
import {splitOperators} from './split-operators.js';
import {hasOperator} from './has-operator.js';
import {IndexedError} from './indexed-error.js';

export type AST = (
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
) & {
	stringified?: string;
};

const parseNot = (input: StringWithIndices[][]): AST => {
	const first = input[0]?.[0];

	if (first === undefined) {
		throw new Error('Unexpected empty input in parseNot.');
	}

	if (
		first.type !== CharacterTypes.operator
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

const _parseOperation = (input: StringWithIndices[]): AST => {
	if (input.length === 0) {
		throw new Error('Unexpected empty input at _parseOperation.');
	}

	if (!hasOperator(input)) {
		throw new IndexedError(
			`Expected "${input
				.map(item => item.originalCharacters)
				.join(' ')}" to have an operator.`,
			input[0]!.from,
			input.at(-1)!.to,
		);
	}

	if (input.length === 1) {
		const item = input[0]!;

		if (item.type === CharacterTypes.variable) {
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

		if (
			first.type === CharacterTypes.bracket
			&& last.type === CharacterTypes.bracket
		) {
			first.characters = first.characters.slice(1);
			++first.from;
			last.characters = last.characters.slice(0, -1);
			--last.to;

			if (first.characters === '') {
				input.shift();
			}

			if (last.characters === '') {
				input.pop();
			}

			return _parseOperation(input);
		}
	}

	return _parseOperations(grouped);
};

const _parseOperations = (input: StringWithIndices[][]): AST => {
	if (input.length === 0) {
		throw new Error('Unexpected empty input at _parseOperation.');
	}

	if (input.length === 1) {
		return _parseOperation(input[0]!);
	}

	const lastItems: StringWithIndices[][] = [input.pop()!];

	let secondToLast: StringWithIndices[] | undefined;
	while (
		(secondToLast = input.at(-1))
		&& secondToLast.length === 1
		&& secondToLast[0]!.type === CharacterTypes.operator
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
			`Expected operator, got "${operatorArray
				.map(item => item.originalCharacters)
				.join(' ')}".`,
			operatorArray[0]!.from,
			operatorArray.at(-1)!.to,
		);
	}

	// !isValidOperator is unnecessary, it's just a typeguard
	if (
		operator.type !== CharacterTypes.operator
		|| !isValidOperatorName(operator.characters)
	) {
		throw new IndexedError(
			`Expected operator, got type "${operator.type}" with value "${operator.originalCharacters}"`,
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
	const withIndices = fromString(raw);

	if (withIndices.length === 0) {
		throw new Error('Unexpected empty string');
	}

	const split = splitOperators(withIndices);

	const translatedMappings = normaliseOperators(split);

	validate(translatedMappings);

	return _parseOperation(translatedMappings);
};
