import { centerX, SCREEN_HEIGHT } from "../../config";
import { UIScene } from "../../objects/abstract/UIScene";
import { Helper } from "../../utils/Helper";

export class UITutorialGameScene extends UIScene {

	constructor () {
		super('UITutorialGameScene');
	}

	init (): void {
		super.init();
		console.log("Called UITutorialGameScene");
	}

	create (): void {
		// 	// Wait until 'UI#to_menu' registered
		// Helper.doTask(() => {
		// 	let called = false;
		// 	do {
		// 		if (this.targetEmitter.inspectEvents('UI#to_menu')) {
		// 			this.targetEmitter.emit('UI#to_menu');
		// 			called = true;
		// 		}
		// 	} while (!called);
		// });
		const leftArrow = this.add.sprite(centerX * 0.25, SCREEN_HEIGHT - 64, 'left_arrow')
			.setOrigin(0, 1);
		const rightArrow = this.add.sprite(centerX * 0.8, leftArrow.y, 'right_arrow')
			.setOrigin(0, 1);
		const execute = this.add.sprite(centerX * 1.75, rightArrow.y, 'up_arrow')
			.setOrigin(0, 1);
		this.registerEvent('restart', this.restartScene.bind(this));
		this.registerEvent('to_menu', this.startToScene.bind(this, 'MenuScene'));
	}

}