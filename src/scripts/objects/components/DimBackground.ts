import { Layer } from "../../utils/Layer";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../config";

export class DimBackground extends Phaser.GameObjects.Graphics {

	private _rectangle: Phaser.Geom.Rectangle;

	constructor (scene: Phaser.Scene, width?: number, height?: number, options?: Phaser.Types.GameObjects.Graphics.Options) {
		super(scene, options);
		scene.add.existing(this);
		this._rectangle = new Phaser.Geom.Rectangle(0, 0, width || SCREEN_WIDTH, height || SCREEN_HEIGHT);
		this.setScrollFactor(0)
			.fillStyle(0x000, 0.8)
			.fillRectShape(this._rectangle)
			.setInteractive(this._rectangle, Phaser.Geom.Rectangle.Contains)
			.setDepth(Layer.UI.FIRST)
			.setVisible(false);
	}

	show (doShow?: boolean): this {
		if (doShow || this.visible) {
			this.disableInteractive();
		}
		else {
			this.setInteractive();
		}
		this.setVisible(doShow || !this.visible);
		return this;
	}

}