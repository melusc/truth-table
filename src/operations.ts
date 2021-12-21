export const operations = {
	iff: (a: boolean, b: boolean) => a === b,
	ifthen: (a: boolean, b: boolean) => !a || b,
	not: (a: boolean) => !a,
	and: (a: boolean, b: boolean) => a && b,
	xor: (a: boolean, b: boolean) => (a ? !b : b),
	or: (a: boolean, b: boolean) => a || b,
} as const;
