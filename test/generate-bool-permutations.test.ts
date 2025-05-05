import assert from 'node:assert/strict';
import test from 'node:test';

import {generateBoolPermutations} from '../src/generate-bool-permutations.js';

await test('[a]', () => {
	assert.deepEqual(
		[...generateBoolPermutations(new Set(['a']))],
		[{a: true}, {a: false}],
	);
});

await test('[a, b]', () => {
	assert.deepEqual(
		[...generateBoolPermutations(new Set(['a', 'b']))],
		[
			{a: true, b: true},
			{a: true, b: false},
			{a: false, b: true},
			{a: false, b: false},
		],
	);
});

await test('[a, b, c]', () => {
	assert.deepEqual(
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
