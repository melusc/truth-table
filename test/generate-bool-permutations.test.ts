import assert from 'node:assert/strict';
import test from 'node:test';

import {generateBoolPermutations} from '../src/generate-bool-permutations.js';

await test('[a]', () => {
	assert.deepEqual(
		[...generateBoolPermutations(new Set(['a']))],
		[{a: false}, {a: true}],
	);
});

await test('[a, b]', () => {
	assert.deepEqual(
		[...generateBoolPermutations(new Set(['a', 'b']))],
		[
			{a: false, b: false},
			{a: false, b: true},
			{a: true, b: false},
			{a: true, b: true},
		],
	);
});

await test('[a, b, c]', () => {
	assert.deepEqual(
		[...generateBoolPermutations(new Set(['a', 'b', 'c']))],
		[
			{a: false, b: false, c: false},
			{a: false, b: false, c: true},
			{a: false, b: true, c: false},
			{a: false, b: true, c: true},
			{a: true, b: false, c: false},
			{a: true, b: false, c: true},
			{a: true, b: true, c: false},
			{a: true, b: true, c: true},
		],
	);
});
