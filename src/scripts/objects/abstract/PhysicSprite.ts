export abstract class PhysicSprite extends Phaser.Physics.Arcade.Sprite {

	private _body: Phaser.Physics.Arcade.Body;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, isStatic?: boolean) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this, isStatic);
		this._body = this.body as Phaser.Physics.Arcade.Body;
	}

	public getBody (): Phaser.Physics.Arcade.Body {
		return this._body;
	}

	public setAllowGravity (value: boolean): this {
		this.getBody().setAllowGravity(value);
		return this;
	}

}