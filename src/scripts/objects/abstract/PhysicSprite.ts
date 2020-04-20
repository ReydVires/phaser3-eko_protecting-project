export abstract class PhysicSprite extends Phaser.Physics.Arcade.Sprite {

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, isStatic?: boolean) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this, isStatic);
	}

	public getBody (): Phaser.Physics.Arcade.Body {
		return this.body as Phaser.Physics.Arcade.Body;
	}

}