export class Player extends Phaser.Physics.Arcade.Sprite {

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this);
	}

}