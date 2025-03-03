export class IndexedError extends Error {
	public override readonly name = 'IndexedError';
	public readonly from: number;
	public readonly to: number;

	constructor(errorMessage: string, from: number, to: number) {
		super(errorMessage);

		this.from = from;
		this.to = to;
	}
}
