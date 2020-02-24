export class Coin extends Phaser.Physics.Arcade.Sprite {

	private _value: number;
	private _body: Phaser.Physics.Arcade.Body;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this._body = this.body as Phaser.Physics.Arcade.Body;
	}

	public getBody (): Phaser.Physics.Arcade.Body {
		return this._body;
	}
	
	public set value (value: number) {
		this._value = value;
	}
	
	public get value (): number {
		return this._value;
	}

}