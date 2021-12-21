import test from 'ava';

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
test(t1, t => {
	const parsed = parseOperation(t1);

	t.deepEqual(findVariables(parsed), new Set(['A', 'B', 'C', 'D', 'E', 'F']));
});
