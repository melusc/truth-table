import test from 'ava';

import {generateTable} from '../src/generate-table.js';
import {LogicalSymbolFromName} from '../src/logical-symbols.js';

const t1 = 'a OR b';
test(t1, t => {
	t.like(generateTable(t1), {
		columns: ['A', 'B', `A ${LogicalSymbolFromName.or} B`],
		rows: [
			[true, true, true],
			[true, false, true],
			[false, true, true],
			[false, false, false],
		],
	});
});

const t2 = '(a and b) and c';
test(t2, t => {
	t.like(generateTable(t2), {
		columns: [
			'A',
			'B',
			'C',
			`A ${LogicalSymbolFromName.and} B`,
			`(A ${LogicalSymbolFromName.and} B) ${LogicalSymbolFromName.and} C`,
		],
		rows: [
			[true, true, true, true, true],
			[true, true, false, true, false],
			[true, false, true, false, false],
			[true, false, false, false, false],
			[false, true, true, false, false],
			[false, true, false, false, false],
			[false, false, true, false, false],
			[false, false, false, false, false],
		],
	});
});

const t3 = '(a and b) or (a and b)';
test(t3, t => {
	t.like(generateTable(t3), {
		columns: [
			'A',
			'B',
			`A ${LogicalSymbolFromName.and} B`,
			`(A ${LogicalSymbolFromName.and} B) ${LogicalSymbolFromName.or} (A ${LogicalSymbolFromName.and} B)`,
		],
		rows: [
			[true, true, true, true],
			[true, false, false, false],
			[false, true, false, false],
			[false, false, false, false],
		],
	});
});

test('generateTable with includeSteps=false', t => {
	t.like(generateTable('(a & b) | (a & b)', false), {
		columns: [
			'A',
			'B',
			`(A ${LogicalSymbolFromName.and} B) ${LogicalSymbolFromName.or} (A ${LogicalSymbolFromName.and} B)`,
		],
		rows: [
			[true, true, true],
			[true, false, false],
			[false, true, false],
			[false, false, false],
		],
	});
});

test('generateTable with includeSteps=false and no operations', t => {
	t.like(generateTable('A', false), {
		columns: ['A'],
		rows: [[true], [false]],
	});
});
