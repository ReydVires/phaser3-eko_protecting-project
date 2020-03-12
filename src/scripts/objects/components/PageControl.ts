export class PageControl<T> {

	private _prevPages: Array<T>;
	private _nextPages: Array<T>;
	private _activePage: T;

	constructor (page:  Array<T> | T) {
		this._prevPages = new Array<T>();
		this._nextPages = new Array<T>();
		if (Array.isArray(page)) {
			if (page.length > 0) {
				this._activePage = page[0];
				page.shift(); // Discard first element
				this.addNextPage(page);
			}
		}
		else {
			this._activePage = page;
		}
	}

	public addNextPage (page: Array<T> | T): this {
		if (Array.isArray(page)) {
			this._nextPages.push(...page);
		}
		else {
			this._nextPages.push(page);
		}
		return this;
	}

	public addPrevPage (page: Array<T> | T): this {
		if (Array.isArray(page)) {
			this._prevPages.unshift(...page);
		}
		else {
			this._prevPages.unshift(page);
		}
		return this;
	}

	public nextPage (): T {
		const isEmpty = this._nextPages.length === 0;
		if (!isEmpty) {
			const firstItem = this._nextPages[0];
			if (this._activePage !== firstItem) {
				const activePage = this._nextPages.shift();
				this._prevPages.push(this._activePage);
				this._activePage = <T>activePage;
			}
		}
		else {
			console.log("nextPage nothing change!");
		}
		return this._activePage;
	}

	public prevPage (): T {
		const isEmpty = this._prevPages.length === 0;
		if (!isEmpty) {
			const lastItem = this._prevPages[this._prevPages.length - 1];
			if (this._activePage !== lastItem) {
				const activePage = this._prevPages.pop();
				this._nextPages.unshift(this._activePage);
				this._activePage = <T>activePage;
			}
		}
		else {
			console.log("prevPage nothing change!");
		}
		return this._activePage;
	}

	public activePage (): T {
		return this._activePage;
	}

	public getAllPages (): Array<T> {
		return [...this._prevPages, this._activePage, ...this._nextPages];
	}

	public clearPages (activePage: T): this {
		this._activePage = activePage;
		this._nextPages = [];
		this._prevPages = [];
		console.log("clearing PageControl!");
		return this;
	}

	public inspectPages (): void {
		console.log("active", this._activePage);
		console.log("prev", this._prevPages);
		console.log("next", this._nextPages);
	}

}