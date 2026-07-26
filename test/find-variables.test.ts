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

import assert from 'node:assert/strict';
import test from 'node:test';

import {findVariables} from '../src/find-variables.js';
import {parseOperation} from '../src/parse-operation.js';

const t1 = `
(
	a && (b || c)
	xor
	(
		(d -> c) <-> e
	)
) && (e || c) -> f`;
await test(t1, () => {
	const parsed = parseOperation(t1);

	assert.deepEqual(
		findVariables(parsed, true),
		new Set(['A', 'B', 'C', 'D', 'E', 'F']),
	);
});

const t2 = `A || C || D || B`;
await test(t2, () => {
	const parsed = parseOperation(t2);

	assert.deepEqual(findVariables(parsed, false), new Set('ACDB'));
});
