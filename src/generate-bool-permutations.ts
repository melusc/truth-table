// Use array because it's easier with recursion
function * generateBoolPermutationsIterator(
	variables: string[],
	acc: Record<string, boolean> = {},
): Iterable<Record<string, boolean>> {
	const variable0 = variables[0];

	if (variable0) {
		yield * generateBoolPermutationsIterator(variables.slice(1), {
			...acc,
			[variable0]: true,
		});

		yield * generateBoolPermutationsIterator(variables.slice(1), {
			...acc,
			[variable0]: false,
		});
	} else {
		yield acc;
	}
}

// Use Set to not have duplicates
export const generateBoolPermutations = (
	variables: Set<string>,
): Iterable<Record<string, boolean>> =>
	generateBoolPermutationsIterator([...variables]);
