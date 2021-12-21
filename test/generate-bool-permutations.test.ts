import test from 'ava';

import {generateBoolPermutations} from '../src/generate-bool-permutations.js';

test('[a]', t => {
	t.deepEqual(
		[...generateBoolPermutations(new Set(['a']))],
		[{a: true}, {a: false}],
	);
});

test('[a, b]', t => {
	t.deepEqual(
		[...generateBoolPermutations(new Set(['a', 'b']))],
		[
			{a: true, b: true},
			{a: true, b: false},
			{a: false, b: true},
			{a: false, b: false},
		],
	);
});

test('[a, b, c]', t => {
	t.deepEqual(
		[...generateBoolPermutations(new Set(['a', 'b', 'c']))],
		[
			{a: true, b: true, c: true},
			{a: true, b: true, c: false},
			{a: true, b: false, c: true},
			{a: true, b: false, c: false},
			{a: false, b: true, c: true},
			{a: false, b: true, c: false},
			{a: false, b: false, c: true},
			{a: false, b: false, c: false},
		],
	);
});
