import test from 'ava';

import {evalOperation} from '../src/eval.js';
import {Operator} from '../src/operators.js';
import {parseOperation} from '../src/parse-operation.js';

const t1 = `
(
	a && (b || c)
	xor
	(
		(d -> c) <-> e
	)
) && (!e || c) -> f`;
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

const t2 = 'a xnor b';
test(t2, t => {
	const parsed = parseOperation(t2);

	t.is(evalOperation(parsed, {A: true, B: true}), true);
	t.is(evalOperation(parsed, {A: true, B: false}), false);
	t.is(evalOperation(parsed, {A: false, B: true}), false);
	t.is(evalOperation(parsed, {A: false, B: false}), true);
});

const t3 = 'a NAND b';
test(t3, t => {
	const parsed = parseOperation(t3);

	t.is(evalOperation(parsed, {A: true, B: true}), false);
	t.is(evalOperation(parsed, {A: true, B: false}), true);
	t.is(evalOperation(parsed, {A: false, B: true}), true);
	t.is(evalOperation(parsed, {A: false, B: false}), true);
});

const t4 = 'a NOR b';
test(t4, t => {
	const parsed = parseOperation(t4);

	t.is(evalOperation(parsed, {A: true, B: true}), false);
	t.is(evalOperation(parsed, {A: true, B: false}), false);
	t.is(evalOperation(parsed, {A: false, B: true}), false);
	t.is(evalOperation(parsed, {A: false, B: false}), true);
});

test('Unexpected type', t => {
	t.throws(() => {
		evalOperation(
			{
				type: 'abc' as 'operator',
				operator: Operator.and,
				values: [
					{
						type: 'variable',
						variable: 'A',
					},
					{
						type: 'variable',
						variable: 'B',
					},
				],
			},
			{
				A: true,
				B: true,
			},
		);
	});
});
