export class FPSText extends Phaser.GameObjects.Text {

	constructor (scene: Phaser.Scene) {
		super(scene, 10, 10, '', <Phaser.Types.GameObjects.Text.TextStyle> {
			fontFamily: 'Comfortaa',
			color: 'black',
			fontSize: '32px',
			fontStyle: 'bold'
		});
		scene.add.existing(this);
		this.setOrigin(0)
			.setScrollFactor(0);
	}

	public update (): void {
		this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`);
	}

}
