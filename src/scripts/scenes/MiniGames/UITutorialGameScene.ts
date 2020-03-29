import { Plugins } from '@capacitor/core';
import { centerX, SCREEN_HEIGHT, SCREEN_WIDTH, centerY } from "../../config";
import { UIScene } from "../../objects/abstract/UIScene";
import { FillProgress } from "../../objects/FillProgress";
import { DimBackground } from '../../objects/components/DimBackground';
import { FlatButton } from '../../objects/components/FlatButton';

const { App } = Plugins;

export class UITutorialGameScene extends UIScene {

	private _gameTime: FillProgress;
	private _dimBackground: DimBackground;

	constructor () {
		super('UITutorialGameScene');
	}

	init (): void {
		super.init();
		console.log("Called UITutorialGameScene");
		App?.addListener("backButton", this.startToScene.bind(this, 'MenuScene'));
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

		this.add.text(centerX * 0.25, centerY * 0.75, "TAP!");
		const leftArrow = this.add.sprite(centerX * 0.25, SCREEN_HEIGHT - 64, 'left_arrow')
			.setOrigin(0, 1);
		const rightArrow = this.add.sprite(centerX * 0.8, leftArrow.y, 'right_arrow')
			.setOrigin(0, 1);
		this.add.sprite(centerX * 1.75, rightArrow.y, 'up_arrow')
			.setOrigin(0, 1);
		new FlatButton(this, 95, 600, 'InventorySmall_btn')
			.setScrollFactor(0);

		this._gameTime = new FillProgress(this, centerX, 20, SCREEN_WIDTH, 32);
		this._gameTime.setCallback(() => {
			console.log("Times up!");
			this.targetEmitter.emit('event#enemy_attack', false);
			// this._dimBackground.setVisible(true);
			// this.pauseScene(true);
		});

		this._dimBackground = new DimBackground(this);

		this.registerEvent('restart', this.restartScene.bind(this));
		this.registerEvent('to_menu', this.startToScene.bind(this, 'MenuScene'));
		this.registerEvent('stop_timer', () => {
			this._gameTime?.stop();
		}, true);
	}

	update (time: number, dt: number): void {
		this._gameTime?.updateProgressbar(5);

		if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC'))) {
			this.targetEmitter.emit('UI#to_menu');
		}
	}

}