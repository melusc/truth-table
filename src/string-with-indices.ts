export type StringWithIndices = Readonly<{
	characters: string;
	type: CharacterTypes;
	from: number;
	to: number;
	source: string;
}>;

const VARIABLES_RE = /^[a-z_]+$/i;
const BRACKETS_RE = /^[()]+$/;

export const enum CharacterTypes {
	variable = 'variable',
	operator = 'operator',
	bracket = 'bracket',
}

export const fromString = (input: string): StringWithIndices[] => {
	input = input.normalize('NFKC');

	const result: StringWithIndices[] = [];
	for (const match of input.matchAll(/[a-z_]+|[()]|[^a-z_()\s]+/gi)) {
		const characters = match[0];
		const from = match.index;
		if (typeof from !== 'number') {
			throw new TypeError('Expected a number on match.index');
		}

		let type: CharacterTypes;
		if (VARIABLES_RE.test(characters)) {
			type = CharacterTypes.variable;
		} else if (BRACKETS_RE.test(characters)) {
			type = CharacterTypes.bracket;
		} else {
			type = CharacterTypes.operator;
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
