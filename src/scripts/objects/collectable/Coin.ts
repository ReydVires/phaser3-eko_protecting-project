import { PhysicSprite } from "../abstract/PhysicSprite";
import { ICollectable } from "../interface/ICollectable";

export class Coin extends PhysicSprite implements ICollectable {

	private _value: number;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, value: number = 10) {
		super(scene, x, y, texture);
		const tweenConfig = <Phaser.Types.Tweens.TweenBuilderConfig> {
			targets: this,
			y: '+=12',
			yoyo: true,
			repeat: -1,
			duration: Phaser.Math.Between(600, 1200)
		};
		this.value = value;
		scene.tweens.add(tweenConfig);
	}

	public collect(): number {
		this.destroy();
		return this.value;
	}

	public set value (value: number) {
		this._value = value;
	}
	
	public get value (): number {
		return this._value;
	}

}