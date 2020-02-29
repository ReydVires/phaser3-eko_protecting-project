import { Layer } from "../../utils/Layer";

export class PopUpWindow extends Phaser.GameObjects.Container {

	private _windowTexture: Phaser.GameObjects.Sprite;

	constructor (scene: Phaser.Scene, x: number, y: number, windowTexture: string = '', children?: Phaser.GameObjects.GameObject[]) {
		super(scene, x, y, children);
		scene.add.existing(this);
		if (windowTexture) {
			this._windowTexture = scene.add.sprite(x, y, windowTexture);
		}
		this.setDepth(Layer.UI.FIRST);
	}

	public get windowTexture (): Phaser.GameObjects.Sprite {
		return this._windowTexture;
	}

	public get windowWidth (): number {
		return this._windowTexture!.displayWidth;
	}
	
	public get windowHeight (): number {
		return this._windowTexture!.displayHeight;
	}
	
	public get windowOrigin (): Phaser.Geom.Point {
		if (this._windowTexture) {
			return new Phaser.Geom.Point(
				this._windowTexture.displayOriginX,
				this._windowTexture.displayOriginY,
			);
		}
		return new Phaser.Geom.Point(0.5);
	}

	public setVisible (value: boolean): this {
		this._windowTexture!.setVisible(value);
		super.setVisible(value);
		return this;
	}

}