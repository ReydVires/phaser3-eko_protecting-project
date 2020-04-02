interface ISpriteTextures {
	active: string;
	deactive: string;
}

export class ToggleButton extends Phaser.GameObjects.Sprite {

	private _spriteTextures: ISpriteTextures;
	private _onActive: boolean;
	private _pressed: boolean;
	private _callback: unknown;

	constructor (scene: Phaser.Scene, x: number, y: number, textures: ISpriteTextures, onActive?: boolean) {
		super(scene, x, y, textures.deactive);
		this._spriteTextures = textures;
		this._onActive = onActive ? true : false;
		this._pressed = false;
		this.interactiveEvent();
	}

	private interactiveEvent (): void {
		this.setInteractive({ useHandCursor: true })
		.on('pointerdown', () => {
			this._pressed = true;
		})
		.on('pointerup', () => {
			if (this._pressed) {
				this.onClick();
			}
		})
		.on('pointerout', () => {
			this._pressed = false;
		});
	}

	private onClick (): void {
		if (this._callback instanceof Function) {
			this._callback(this._onActive);
		}
		this._onActive = !this._onActive;
		const getTexture = this._onActive ? this._spriteTextures.active : this._spriteTextures.deactive;
		this.setTexture(getTexture);
	}

	public get value (): boolean {
		return this._onActive;
	}

	public setCallback (callback: Function): this {
		this._callback = callback;
		return this;
	}

}
