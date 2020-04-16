export class ItemStore extends Phaser.GameObjects.Image {

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		this.setName(name);
	}

}