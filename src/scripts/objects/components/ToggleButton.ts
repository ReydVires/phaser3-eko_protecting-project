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
		super(scene, x, y, "");
		scene.add.existing(this);
		this._spriteTextures = textures;
		this._pressed = false;
		this._onActive = onActive ? true : false;
		this.changeTexture();
		this.initInteractive();
	}

	private initInteractive (): void {
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
		this._onActive = !this._onActive;
		if (this._callback instanceof Function) {
			this._callback(this._onActive);
		}
		this.changeTexture();
	}

	private changeTexture (): void {
		const getTexture = this._onActive ? this._spriteTextures?.active : this._spriteTextures?.deactive;
		this.setTexture(getTexture);
	}

	public get value (): boolean {
		return this._onActive;
	}

	public setDeactive (value: boolean): this {
		this._onActive = !value;
		this.changeTexture();
		return this;
	}

	public setCallback (callback: Function): this {
		this._callback = callback;
		return this;
	}

}
