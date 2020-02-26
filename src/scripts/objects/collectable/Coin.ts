import { PhysicSprite } from "../abstract/PhysicSprite";

export class Coin extends PhysicSprite {

	private _value: number;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
	}
	
	public set value (value: number) {
		this._value = value;
	}
	
	public get value (): number {
		return this._value;
	}

}