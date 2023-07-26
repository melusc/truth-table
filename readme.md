# @lusc/truth-table

@lusc/truth-table can parse truth statements and generate truth tables. [Try it out](https://melusc.github.io/truth-table).

Given a statement like
`A AND B`
It'll generate a table like

| A     | B     | A ∧ B |
| ----- | ----- | ----- |
| true  | true  | true  |
| true  | false | false |
| false | true  | false |
| false | false | false |

## Supported Operators

- AND
- OR
- XOR
- NOT
- IFF
- IFTHEN

See [operator-aliases.md](./operator-aliases.md) for all the aliases.

## Variables

A variable is made up of at least one character.
It must contain only latin letters (a-z).
Variables are case-insensitive.
`and`, `or`, and so on are reserved and will be treated as operators.

## AST

The truth statement is parsed and an AST is generated.
The shape of the AST is as follows.

### Variable

A variable is made of any latin letter. Variables are case insensitive. Additionally, `_` is permitted.

A variable matches the regex `/^[a-z_]+$/i`.

```ts
type AST = {
	type: 'variable';
	variable: string;
};
```

### Not-operator

```ts
type AST = {
	type: 'operator';
	operator: 'not';
	values: [AST];
};
```

### Other operators

```ts
type AST = {
	type: 'operator';
	operator: 'iff' | 'ifthen' | 'and' | 'xor' | 'or';
	values: [AST, AST];
};
```

## IndexedError

This extends `Error` and has `from` and `to` indicating were in the string there is an error.
`from` is inclusive, `to` is exclusive.

```ts
parseOperation('(a & b');
/*
IndexedError {
	message: "Unmatched opening parens at position 0.",
	from: 0,
	to: 1
}
*/
```

## parseOperation

```ts
function parseOperation(input: string): AST;
```

If there are invalid characters, unmatched parens, two operators following each other or similar it throws [`IndexedError`](#indexederror).
For all other errors `Error` is thrown.

## operationToString

`operationToString` takes an [`AST`](#ast) as input and returns a string representation of the AST.

Example:

```ts
const ast = parseOperation('a & b');
operationToString(ast); // === "(A ∧ B)"
```

## generateTable

```ts
function generateTable(input: string, includeSteps = true): ParsedTable;

type ParsedTable = {
	columns: readonly string[];
	rows: readonly boolean[][];
	ast: AST;
};
```

`input` is the operation that will be parsed.

If `includeSteps` is `false`, an operation like `(a & b) | c` will return the columns
`A`, `B`, `C`, and `(A ∧ B) ∨ C`.
Otherwise it additionally returns `A ∧ B`.

The input is passed to [`parseOperation`](#parseoperation) and throws the same errors.

Example:

```ts
generateTable('a != b');
// returns
{
	columns: ['A', 'B', 'A ↮ B'],
	rows: [
		[ true,  true,  false ],
		[ true,  false, true  ],
		[ false, true,  true  ],
		[ false, false, false ]
	],
	ast: {...}
}
```
