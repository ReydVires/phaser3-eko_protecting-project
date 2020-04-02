import { centerX, SCREEN_HEIGHT, SCREEN_WIDTH, centerY } from "../../config";
import { UIScene } from "../../objects/abstract/UIScene";
import { FillProgress } from "../../objects/FillProgress";
import { DimBackground } from '../../objects/components/DimBackground';
import { FlatButton } from '../../objects/components/FlatButton';
import { PopUpWindow } from '../../objects/components/PopUpWindow';
import { AndroidBackHelper } from "../../utils/AndroidBackHelper";

export class UITutorialGameScene extends UIScene {

	private _gameTime: FillProgress;
	private _windowPause: PopUpWindow;
	private _dimBackground: DimBackground;

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
		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			this.startToScene('MenuScene');
		});

		this.add.text(centerX * 0.25, centerY * 0.75, "TAP!");
		const leftArrow = this.add.sprite(centerX * 0.25, SCREEN_HEIGHT - 64, 'left_arrow')
			.setOrigin(0, 1);
		const rightArrow = this.add.sprite(centerX * 0.8, leftArrow.y, 'right_arrow')
			.setOrigin(0, 1);
		this.add.sprite(centerX * 1.75, rightArrow.y, 'up_arrow')
			.setOrigin(0, 1);

		new FlatButton(this, 1189, 70, 'pause_btn')
			.setScrollFactor(0)
			.setCallback(() => this.targetEmitter.emit('UI#do_pause'));
		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(() => this.targetEmitter.emit('UI#do_pause')),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
				.setCallback(() => this.startToScene('MenuScene'))
		]).setVisible(false);

		this._gameTime = new FillProgress(this, centerX, 20, SCREEN_WIDTH, 32);
		this._gameTime.setCallback(() => {
			console.log("Times up!");
			this.targetEmitter.emit('event#enemy_attack', false);
			// this._dimBackground.setVisible(true);
			// this.pauseScene(true);
		});

		this._dimBackground = new DimBackground(this);

		this.registerEvent('do_pause', this.doPause.bind(this));
		this.registerEvent('restart', this.restartScene.bind(this));
		this.registerEvent('to_menu', this.startToScene.bind(this, 'MenuScene'));
		this.registerEvent('stop_timer', () => this._gameTime?.stop(), true);
		this.registerEvent('reset_timer', () => this._gameTime?.resetProgress());
	}

	update (time: number, dt: number): void {
		if (!this.isScenePause) {
			this._gameTime?.updateProgressbar(5);
		}

		if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC'))) {
			this.targetEmitter.emit('UI#to_menu');
		}
	}

	doPause (): void {
		const isVisible = this._windowPause.visible;
		this.pauseScene(!isVisible);
		this._windowPause.setVisible(!isVisible);
		this._dimBackground.show();
	}

}