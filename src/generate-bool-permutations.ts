type BoolPermutations = Readonly<Record<string, boolean>>;

// Use array because it's easier with recursion
function* generateBoolPermutationsIterator(
	variables: readonly string[],
	offset = 0,
	accumulator: BoolPermutations = {},
): Iterable<BoolPermutations> {
	const variable0 = variables[offset];
	++offset;

	if (variable0) {
		yield* generateBoolPermutationsIterator(variables, offset, {
			...accumulator,
			[variable0]: true,
		});

		yield* generateBoolPermutationsIterator(variables, offset, {
			...accumulator,
			[variable0]: false,
		});
	} else {
		yield accumulator;
	}
}

// Use Set to not have duplicates
export const generateBoolPermutations = (
	variables: ReadonlySet<string>,
): Iterable<BoolPermutations> =>
	generateBoolPermutationsIterator([...variables]);
