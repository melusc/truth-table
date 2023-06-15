export type Tokens = Readonly<{
	characters: string;
	type: TokenType;
	from: number;
	to: number;
	source: string;
}>;

const VARIABLES_RE = /^[a-z_]+$/i;
const BRACKETS_RE = /^[()]+$/;

export const enum TokenType {
	variable = 'variable',
	operator = 'operator',
	bracket = 'bracket',
}

export const tokenize = (input: string): Tokens[] => {
	input = input.normalize('NFKC');

	const result: Tokens[] = [];
	for (const match of input.matchAll(/[a-z_]+|[()]|[^a-z_()\s]+/gi)) {
		const characters = match[0];
		const from = match.index;
		if (typeof from !== 'number') {
			throw new TypeError('Expected a number on match.index');
		}

		let type: TokenType;
		if (VARIABLES_RE.test(characters)) {
			type = TokenType.variable;
		} else if (BRACKETS_RE.test(characters)) {
			type = TokenType.bracket;
		} else {
			type = TokenType.operator;
		}

		result.push({
			characters: characters.toUpperCase(),
			from,
			to: from + characters.length,
			type,
			source: input,
		});
	}

	return result;
};
