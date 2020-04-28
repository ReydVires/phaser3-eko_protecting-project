import { BaseScene } from '../objects/abstract/BaseScene';

export type SceneData = {
	isTryAgain: boolean,
	isGameStarted: boolean
};
export class GameScene extends BaseScene {

	constructor () {
		super('GameScene');
	}

	init (data: object): void {
		super.init(data);
		console.log(`GameScene`);
	}

	create (): void {
		const test1 = this.add.bitmapText(64, 64, 'comfortaa_b', 'Comfortaa Black')
			.setFontSize(32);
		
		const test2 = this.add.bitmapText(64, test1.y + 64, 'comfortaa_b_bold', 'Comfortaa Black Bold')
			.setFontSize(32);

		const test3 = this.add.bitmapText(64, test2.y + 64, 'comfortaa_w', 'Comfortaa White')
			.setFontSize(32);

		const test4 = this.add.bitmapText(64, test3.y + 64, 'simply_round', 'Simply Round Black')
			.setFontSize(32);

		this.add.bitmapText(64, test4.y + 64, 'simply_roundw', 'Simply Round White')
			.setFontSize(32);
	}

	update (): void {}

}
