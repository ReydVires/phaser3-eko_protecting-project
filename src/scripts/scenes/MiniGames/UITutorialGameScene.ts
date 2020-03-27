import { centerX, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../config";
import { UIScene } from "../../objects/abstract/UIScene";
import { FillProgress } from "../../objects/FillProgress";

export class UITutorialGameScene extends UIScene {

	private _gameTime: FillProgress;

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

		this._gameTime = new FillProgress(this, centerX, 32, SCREEN_WIDTH, 32);
		this._gameTime.setCallback(() => {
			console.log("End call");
		});

		this.registerEvent('restart', this.restartScene.bind(this));
		this.registerEvent('to_menu', this.startToScene.bind(this, 'MenuScene'));
	}

	update (time: number, dt: number): void {
		const isEnd = this._gameTime?.updateProgressbar(5) <= 0;
	}

}