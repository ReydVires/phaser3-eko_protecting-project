export class HoldButton extends Phaser.GameObjects.Sprite {

	private _pressed: boolean = false;
	private _callback: Function;
	private _argument: unknown;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		this.initInteractive();
	}

	private initInteractive (): void {
		this.setInteractive({ useHandCursor: true })
		.on('pointerdown', () => {
			this._pressed = true;
			this.onDown();
		})
		.on('pointerup', () => {
			this._pressed = false;
			this.onUp();
		})
		.on('pointerout', () => {
			this._pressed = false;
			this.onUp();
		});
	}

	private onClick (): void {
		this._callback(this._argument);
	}

	private onDown (): void {
		this.setAlpha(0.85);
	}

	private onUp (): void {
		this.setAlpha(1);
	}

	public getArgument (): unknown {
		return this._argument;
	}

	public setCallback (callback: Function, arg?: unknown): this {
		this._argument = arg;
		this._callback = (typeof callback === 'function') ? callback :
			() => { console.log("HoldButton default callback"); };
		return this;
	}

	preUpdate (): void {
		if (this._pressed && (this._callback instanceof Function)) {
			this.onClick();
		}
	}
}