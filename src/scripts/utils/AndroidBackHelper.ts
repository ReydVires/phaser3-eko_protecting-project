export class AndroidBackHelper {

	private static _instance: AndroidBackHelper;
	private _callback: unknown;
	private _argument: unknown;
	private _clear: boolean;
	
	private constructor () {
		// TODO: Singleton need to be along with GameManager later
		document.addEventListener('backbutton', () => {
			this.callBackButton();
		}, false);
	}

	public static get Instance (): AndroidBackHelper {
		if (!this._instance) {
			this._instance =  new AndroidBackHelper();
		}
		return this._instance;
	}

	public setCallbackBackButton (callback: Function, arg?: any, clear: boolean = false): void {
		this._callback = callback;
		this._argument = arg;
		this._clear = clear;
	}

	private callBackButton (): void {
		if (this._callback instanceof Function) {
			if (typeof this._argument !== "undefined") {
				this._callback(this._argument);
				if (this._clear) {
					this._argument = undefined;
				}
			}
			else {
				this._callback();
			}
		}
	}

}