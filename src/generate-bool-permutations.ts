/*!
 * This file is part of @lusc/truth-table, a logic parser and table generator.
 * Copyright (C) 2026, Luca Schnellmann <oss@lusc.ch>

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
			[variable0]: false,
		});

		yield* generateBoolPermutationsIterator(variables, offset, {
			...accumulator,
			[variable0]: true,
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
