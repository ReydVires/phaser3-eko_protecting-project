export class FPSText extends Phaser.GameObjects.BitmapText {

	constructor (scene: Phaser.Scene) {
		super(scene, 10, 10, 'comfortaa_b_bold');
		scene.add.existing(this);
		this.setOrigin(0)
			.setScrollFactor(0)
			.setFontSize(32);
	}

	public update (): void {
		this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`);
	}

}
