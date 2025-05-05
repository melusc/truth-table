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
		findVariables(parsed),
		new Set(['A', 'B', 'C', 'D', 'E', 'F']),
	);
});
