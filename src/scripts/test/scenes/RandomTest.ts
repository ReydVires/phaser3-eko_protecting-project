export class RandomTest extends Phaser.Scene {

	constructor () {
		super('RandomTest');
	}

	init (): void {}

	create (): void {
		const x = 512;
		const y = 256;
		this.add.image(x, y, 'cave_entrance').setOrigin(0, 1);

		const dX = 101 + x;
		const dY = -51 + y;
		const door = this.add.image(dX, dY, 'cave_door').setOrigin(0, 1);

		const doorMask = this.add.image(dX, dY, 'cave_door').setOrigin(0, 1).setVisible(false);
		door.setMask(new Phaser.Display.Masks.BitmapMask(this, doorMask));
		
		door.setData('originY', door.y);
		this.input.on('pointerup', () => {
			this.tweens.add({
				targets: door,
				props: {
					y: {
						getStart: () => door.getData('originY')!,
						getEnd: () => door.y + 100
					}
				},
				duration: 315,
			});
		});
	}

}