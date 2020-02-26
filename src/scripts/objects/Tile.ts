import { PhysicSprite } from "./abstract/PhysicSprite";

export class Tile extends PhysicSprite {

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture, true);
		this.setOrigin(0)
			.setVisible(false);
	}

}