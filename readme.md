# @lusc/truth-table

@lusc/truth-table can parse truth statements and generate truth tables. [Try it out](https://melusc.github.io/truth-table).

A statement such as `A AND B` passed to [`generateTable`](#generatetable)
will generate a table as seen below.

| A     | B     | A ∧ B |
| ----- | ----- | ----- |
| true  | true  | true  |
| true  | false | false |
| false | true  | false |
| false | false | false |

Though generating tables is what this package was made for,
it can easily be used to only parse a truth statement and generate an AST representation of the statement. See [`parseOperation`](#parseoperation).

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

## IndexedError

This extends `Error` and has `from` and `to` indicating were in the string there is an error.
`from` is inclusive, `to` is exclusive. The message describes what the issue is and `from` and `to` can be used, for example, to highlight the problematic characters.

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

It returns [`AST`](#ast).

## operationToString

`operationToString` takes an [`AST`](#ast) as input and returns a string representation of the AST.
It doesn't return the original input but instead returns a standardised form.

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

By default, it will show each step to get to the result.
For example with a statement like `(a & b) | c`,
it will first contain the columns for the variables,
then the column for `A ∧ B`, then the column for `(A ∧ B) ∨ C`.

If `includeSteps` is set to `false`, it will omit all steps
and only return columns of the variables and the full statement.

The input is passed to [`parseOperation`](#parseoperation) so it will throw the same errors.

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

## Operator

This is an enum used to identify the type of operation.

It's implementation is pretty straightforward:

```ts
enum Operator {
	iff = 'iff',
	ifthen = 'ifthen',
	not = 'not',
	and = 'and',
	xor = 'xor',
	or = 'or',
}
```

## AST

This is a representation of any given truth statement.
The shape of the AST is as follows.

### For variables

A variable is made of any latin letters. Variables are case insensitive. Additionally, `_` is permitted.

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
	operator: Operator.not;
	values: [AST];
};
```

### Other operators

```ts
type AST = {
	type: 'operator';
	operator: Operator.and | Operator.or | ...; // All operators except Operator.not
	values: [AST, AST];
};
```
