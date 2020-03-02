import { Layer } from "../../utils/Layer";

export class Button extends Phaser.GameObjects.Sprite {

	private _pressed: boolean = false;
	private _callback: Function;
	private _argument: unknown;
	private _pressedTexture: string;
	private _justOnce: boolean = false;
	private _noLongerActive: boolean = false;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, pressedTexture?: string) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		if (pressedTexture) {
			this.setPressedTexture(pressedTexture);
		}
		this.interactiveEvent();
		this.setDepth(Layer.UI.DEFAULT);
	}

	private onDown (): void {
		if (this.texture.frameTotal > 2) {
			this.setFrame(1);
		}
		else if (this._pressedTexture) {
			this.setTexture(this._pressedTexture);
		}
	}

	private onUp (): void {
		this.setFrame(0);
	}

	private onClick (): void {
		this.scene.time.addEvent({
			delay: 25,
			callback: () => {
				if (this._callback) {
					this._callback(this._argument);
				}
				else {
					console.log('Callback is not set');
				}
			}
		});
	}

	private interactiveEvent (): void {
		this.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				this._pressed = true;
				this.onDown();
			})
			.on('pointerup', () => {
				if (this._pressed) {
					if (!this._justOnce) {
						this.onClick();
					}
					else {
						if (!this._noLongerActive) {
							this.onClick();
							this._noLongerActive = true;
						}
					}
				}
				this.onUp();
			})
			.on('pointerout', () => {
				this._pressed = false;
				this.onUp();
			});
	}

	public setCallback (callback: Function, arg?: unknown): this {
		this._argument = arg;
		this._callback = (typeof callback === 'function') ? callback :
			() => { console.log("Default"); };
		return this;
	}

	public setPressedTexture (texture: string): this {
		this._pressedTexture = texture;
		return this;
	}

	public setJustOnce (isJustOnce: boolean = true): this {
		this._justOnce = isJustOnce;
		return this;
	}

	public getArgument (): unknown {
		return this._argument;
	}
}