export class IndexedError extends Error {
	public override readonly name = 'IndexedError';

	constructor(
		errorMessage: string,
		public from: number,
		public to: number,
	) {
		super(errorMessage);
	}
}
