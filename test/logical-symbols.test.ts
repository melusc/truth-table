import test from 'ava';

import {
	LogicalSymbolFromName,
	NameFromLogicalSymbol,
} from '../src/logical-symbols.js';

test('operators', t => {
	t.is(
		NameFromLogicalSymbol[LogicalSymbolFromName.iff],
		'iff' as NameFromLogicalSymbol,
	);
	t.is(
		NameFromLogicalSymbol[LogicalSymbolFromName.ifthen],
		'ifthen' as NameFromLogicalSymbol,
	);
	t.is(
		NameFromLogicalSymbol[LogicalSymbolFromName.not],
		'not' as NameFromLogicalSymbol,
	);
	t.is(
		NameFromLogicalSymbol[LogicalSymbolFromName.and],
		'and' as NameFromLogicalSymbol,
	);
	t.is(
		NameFromLogicalSymbol[LogicalSymbolFromName.xor],
		'xor' as NameFromLogicalSymbol,
	);
	t.is(
		NameFromLogicalSymbol[LogicalSymbolFromName.or],
		'or' as NameFromLogicalSymbol,
	);
});
