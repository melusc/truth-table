import {IndexedError} from './indexed-error.js';
import {Operator} from './operators.js';
import {operatorAliases, singleCharacterNotAliases} from './operator-alias.js';

export type Token = Readonly<
	| {
			type: TokenType.bracket;
			bracketType: 'open' | 'close';
			from: number;
			to: number;
			source: string;
	  }
	| {
			type: TokenType.operator;
			operator: Operator;
			from: number;
			to: number;
			source: string;
	  }
	| {
			characters: string;
			type: TokenType.variable;
			from: number;
			to: number;
			source: string;
	  }
>;

const VARIABLES_RE = /^[a-z_]+$/i;
const BRACKETS_RE = /^[()]+$/;

export const enum TokenType {
	variable = 'variable',
	operator = 'operator',
	bracket = 'bracket',
}

function tokenizeOperator(
	characters: string,
	from: number,
	to: number,
	source: string,
): Token[] {
	const result: Token[] = [];

	while (
		characters.length > 0
		&& singleCharacterNotAliases.has(characters.at(-1)!)
	) {
		result.unshift({
			type: TokenType.operator,
			operator: Operator.not,
			from: to - 1,
			to,
			source,
		});

		--to;
		characters = characters.slice(0, -1);
	}

	if (characters.length > 0) {
		const operator = operatorAliases.get(characters.toLowerCase());
		if (!operator) {
			throw new IndexedError(`Unknown operator "${characters}".`, from, to);
		}

		result.unshift({
			type: TokenType.operator,
			operator,
			from,
			to,
			source,
		});
	}

	return result;
}

export const tokenize = (input: string): Token[] => {
	input = input.normalize('NFKC');

	const result: Token[] = [];
	for (const match of input.matchAll(/[a-z_]+|[()]|[^a-z_()\s]+/gi)) {
		const characters = match[0];
		const from = match.index;
		if (typeof from !== 'number') {
			throw new TypeError('Expected a number on match.index');
		}

		const to = from + characters.length;

		if (VARIABLES_RE.test(characters)) {
			// Handle things like "and"
			if (operatorAliases.has(characters.toLowerCase())) {
				result.push({
					type: TokenType.operator,
					operator: operatorAliases.get(characters.toLowerCase())!,
					from,
					to,
					source: input,
				});
			} else {
				result.push({
					type: TokenType.variable,
					characters: characters.toUpperCase(),
					from,
					to,
					source: input,
				});
			}
		} else if (BRACKETS_RE.test(characters)) {
			result.push({
				type: TokenType.bracket,
				bracketType: characters === '(' ? 'open' : 'close',
				from,
				to,
				source: input,
			});
		} else {
			result.push(...tokenizeOperator(characters, from, to, input));
		}
	}

	return result;
};
