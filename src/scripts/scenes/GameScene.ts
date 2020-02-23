import { centerX, centerY } from '../config';

export class GameScene extends Phaser.Scene {

	constructor () {
		super('GameScene');
	}

	init (): void {
		console.log(`GameScene`);
		const titleText = `Welcome to\nPhaser v${Phaser.VERSION}`;
		this.add
			.text(centerX, centerY, titleText, {
				color: '#000000',
				fontSize: '32px',
				fontStyle: 'bold'
			})
			.setAlign('center')
			.setOrigin(0.5);
	}

	create (): void {}

	update (): void {}

}
