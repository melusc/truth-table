import test from 'ava';

import {evalOperation} from '../src/eval.js';
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
	t.is(
		evalOperation(parsed, {
			A: true,
			B: false,
			C: true,
			D: true,
			E: false,
			F: false,
		}),
		false,
	);

	t.is(
		evalOperation(parsed, {
			A: false,
			B: false,
			C: true,
			D: false,
			E: true,
			F: true,
		}),
		true,
	);
});
