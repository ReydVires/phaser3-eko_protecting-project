import { PhysicSprite } from "../abstract/PhysicSprite";

export class Coin extends PhysicSprite {

	private _value: number;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		const tweenConfig = <Phaser.Types.Tweens.TweenBuilderConfig> {
			targets: this,
			y: '+=12',
			yoyo: true,
			repeat: -1,
			duration: Phaser.Math.Between(600, 1200)
		};
		scene.tweens.add(tweenConfig);
	}
	
	public set value (value: number) {
		this._value = value;
	}
	
	public get value (): number {
		return this._value;
	}

}