export class IndexedError extends Error {
	constructor(errorMessage: string, public from: number, public to: number) {
		super(errorMessage);
	}
}
