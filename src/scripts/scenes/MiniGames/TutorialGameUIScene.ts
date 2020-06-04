//#region Imports module
import { centerX, SCREEN_HEIGHT, SCREEN_WIDTH, centerY, LEFT_AREA, RIGHT_AREA } from "../../config";
import { UIScene } from "../../objects/abstract/UIScene";
import { FillProgress } from "../../objects/FillProgress";
import { DimBackground } from '../../objects/components/DimBackground';
import { FlatButton } from '../../objects/components/FlatButton';
import { PopUpWindow } from '../../objects/components/PopUpWindow';
import { AndroidBackHelper } from "../../utils/AndroidBackHelper";

//#endregion
export class TutorialGameUIScene extends UIScene {

	private _gameTime: FillProgress;
	private _windowPause: PopUpWindow;
	private _dimBackground: DimBackground;
	private _gameOverWindow: PopUpWindow;
	private _stageClearWindow: PopUpWindow;
	private _tutorialWindow: PopUpWindow;
	private _gameStart: boolean;

	constructor () {
		super('TutorialGameUIScene');
	}

	init (): void {
		super.init();
		console.log("Called TutorialGameUIScene");
		this._gameStart = false;
		this.input.enabled = false;
	}

	create (): void {
		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			this.eventHandler.emit('UI#to_scene_menu');
		});

		const cam = this.cameras.main;
		cam.once('camerafadeincomplete', () => {
			this.eventHandler.emit('event#game_start');
			this.input.enabled = true;
			this.showTutorialScene();
		});
		cam.fadeIn(600);

		this._dimBackground = new DimBackground(this);

		this.add.bitmapText(centerX * 0.25, centerY * 0.4, 'simply_roundw', "TAP!").setFontSize(32);
		const leftArrow = this.add.sprite(LEFT_AREA * 0.5, SCREEN_HEIGHT - 64, 'left_arrow')
			.setOrigin(0, 1);
		const rightArrow = this.add.sprite(RIGHT_AREA * 0.5, leftArrow.y, 'right_arrow')
			.setOrigin(0, 1);
		this.add.sprite(RIGHT_AREA * 1.5, rightArrow.y, 'up_arrow')
			.setOrigin(0, 1);

		new FlatButton(this, 1189, 80, 'pause_btn')
			.setCallback(() => this.eventHandler.emit('UI#do_pause'));
		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(() => this.eventHandler.emit('UI#do_pause')),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
				.setCallback(() => this.eventHandler.emit('UI#to_scene_menu'))
		]).setVisible(false).setActive(false);

		this._stageClearWindow = new PopUpWindow(this, centerX, centerY, 'stageclear_win', [
			new FlatButton(this, 0, 0, 'nextstage_btn')
				.setCallback(() => console.log('still not implemented!')),
			new FlatButton(this, 0, 72, 'worldmap_btn')
				.setCallback(() => {
					this.input.enabled = false;
					this.startToScene('WorldmapViews');
				}),
		]).setVisible(false).setActive(false);

		this._gameTime = new FillProgress(this, centerX, 20, SCREEN_WIDTH, 32);
		this._gameTime.setCallback(() => {
			console.log("Times up!");
			this.eventHandler.emit('event#enemy_attack', false);
		});

		let frameSlide = this.add.image(0, 0, 'slide_first');
		let stateSlide = 'ON_LEFT';
		const textSlide = this.add.bitmapText(0, 208, 'comfortaa_b', "Pehatikan area tap! Bagian kiri untuk left tap, " +
		"tengah untuk right tap dan kanan untuk up tap.");
		this._tutorialWindow = new PopUpWindow(this, centerX, centerY, 'how_toPlaym_win', [
			new FlatButton(this, -256, 32, 'prev_btn')
				.setCallback(() => {
					if (stateSlide !== 'ON_LEFT') {
						stateSlide = 'ON_LEFT';
						frameSlide.setTexture('slide_first');
						textSlide.setText("Pehatikan area tap! Bagian kiri untuk left tap, " +
						"tengah untuk right tap dan kanan untuk up tap.");
					}
				}),
			new FlatButton(this, 256, 32, 'next_btn')
				.setCallback(() => {
					if (stateSlide !== 'ON_RIGHT') {
						stateSlide = 'ON_RIGHT';
						frameSlide.setTexture('slide_second');
						textSlide.setText("Ikuti arahan pola diatas sebelum waktu habis " +
						"untuk menghindari serangan dari lumba-lumba!");
					}
				}),
			frameSlide,
			textSlide
				.setCenterAlign()
				.setOrigin(0.5)
				.setFontSize(20)
				.setMaxWidth(475),
			new FlatButton(this, 728 * 0.455, -245, 'exit_btn')
				.setCallback(() => {
					this.showTutorialScene();
					this._gameStart = true;
				})
		]).setVisible(false).setActive(false);

		this._gameOverWindow = new PopUpWindow(this, centerX, centerY, 'gameoverMinigame_win', [
			this.add.bitmapText(0, -72, 'simply_round', "Your Score: 9999")
				.setCenterAlign()
				.setOrigin(0.5)
				.setFontSize(32),
			this.add.bitmapText(0, -21, 'comfortaa_b', "Highest Score: 9999")
				.setCenterAlign()
				.setOrigin(0.5)
				.setFontSize(20),
			this.add.bitmapText(0, 18, 'simply_round', "Reward: 9999 Coins")
				.setCenterAlign()
				.setOrigin(0.5)
				.setFontSize(24),
			new FlatButton(this, -128, 114, 'playagain_btn')
				.setCallback(() => {
					this.input.enabled = false;
					cam.once('camerafadeoutcomplete', () => {
						this.restartScene();
					});
					cam.fadeOut(600);
				}),
			new FlatButton(this, 128, 114, 'mainmenu_btn')
				.setCallback(() => this.eventHandler.emit('UI#to_scene_menu'))
		])
		.setVisible(false).setActive(false);

		this.registerEvent('show_clear_stage', this.showClearStage.bind(this));
		this.registerEvent('do_pause', this.doPause.bind(this));
		this.registerEvent('restart', this.restartScene.bind(this));
		this.registerEvent('do_gameover', this.doGameOver.bind(this));
		this.registerEvent('to_scene_menu', this.startToScene.bind(this, 'MenuViews', {
			isGameStarted: true
		}));
		this.registerEvent('stop_timer', () => this._gameTime?.stop(), true);
		this.registerEvent('reset_timer', () => this._gameTime?.resetProgress());
	}

	update (time: number, dt: number): void {
		if (!this.isScenePause && this._gameStart) {
			this._gameTime?.updateProgressbar(5);
		}

		if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC'))) {
			this.eventHandler.emit('UI#to_scene_menu');
		}
	}

	showClearStage (): void {
		this._stageClearWindow.setVisible(true).setActive(true);
		this._dimBackground.show();
	}

	showTutorialScene (): void {
		this._tutorialWindow.setVisible(!this._tutorialWindow.visible);
		this._tutorialWindow.setActive(this._tutorialWindow.visible);
		this._dimBackground.show();
	}

	doPause (): void {
		const isVisible = this._windowPause.visible;
		this.pauseScene(!isVisible);
		this._windowPause.setVisible(!isVisible);
		this._windowPause.setActive(!isVisible);
		this._dimBackground.show();
	}

	doGameOver (): void {
		this.pauseScene();
		this._gameOverWindow.setVisible(true).setActive(true);
		this._dimBackground.show();
	}

}