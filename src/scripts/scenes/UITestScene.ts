//#region Import modules
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { centerX, centerY } from "../config";
import { FlatButton } from "../objects/components/FlatButton";
import { DimBackground } from "../objects/components/DimBackground";
import { UIScene } from "../objects/abstract/UIScene";
import { FPSText } from "../objects/FPSText";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";

//#endregion

export class UITestScene extends UIScene {

	private _windowPause: PopUpWindow;
	private _gameOverWindow: PopUpWindow;
	private _dimBackground: DimBackground;
	private _fpsText: Phaser.GameObjects.Text;

	constructor () {
		super('UITestScene');
	}

	init (): void {
		super.init();
		console.log('UITestScene');
	}

	create (): void {
		const areaScreenImage = this.add.image(0, 0, 'area_screen_control')
			.setOrigin(0)
			.setAlpha(0.75);
		this.tweens.add({
			targets: areaScreenImage,
			alpha: 0,
			delay: 5000,
			duration: 1000,
			onComplete: () => {
				areaScreenImage.setVisible(false).setActive(false);
				areaScreenImage.destroy();
			}
		});

		this.add.bitmapText(centerX, 0, 'simply_round', "In Testing Mode 123")
			.setOrigin(0.5, 0)
			.setScrollFactor(0)
			.setFontSize(32);

		new FlatButton(this, 1189, 48, 'pause_btn')
			.setScrollFactor(0)
			.setCallback(() => this.targetEmitter.emit('UI#do_pause'));

		this._dimBackground = new DimBackground(this);

		this._fpsText = new FPSText(this);

		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(() => this.targetEmitter.emit('UI#do_pause')),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
				.setCallback(() => this.startToScene('MenuScene', {
					isGameStarted: true,
					isTryAgain: false
				}))
		])
		.setVisible(false);

		this._gameOverWindow = new PopUpWindow(this, centerX, centerY, 'gameoverAdventure_win', [
			new FlatButton(this, 0, 0, 'tryagain_btn')
				.setCallback(() => this.restartScene({ isTryAgain: true })),
			new FlatButton(this, 0, 72, 'worldmap_btn')
				.setCallback(() => alert('Not implemented'))
		])
		.setVisible(false);
		
		this.registerEvent('do_pause', this.doPause.bind(this));
		this.registerEvent('do_gameover', this.doGameOver.bind(this));
		this.registerEvent('to_scene_tutorial', () => {
			this.doCameraFadeOut(this.startToScene.bind(this, "TutorialGameScene"));
		});
		this.registerEvent('disable_input', () => { this.input.enabled = false; });

		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			this.targetEmitter.emit('UI#do_pause');
		});
	}

	doCameraFadeOut (onComplete: Function): void {
		this.targetEmitter.emit('UI#disable_input');
		const cam = this.cameras.main;
		cam.once('camerafadeoutcomplete', () => onComplete());
		cam.fadeOut(600);
	}

	doPause (): void {
		const isVisible = this._windowPause.visible;
		this.pauseScene(!isVisible);
		this._windowPause.setVisible(!isVisible);
		this._dimBackground.show();
	}

	doGameOver (): void {
		this.pauseScene();
		this._gameOverWindow.setVisible(true);
		this._dimBackground.show();
	}

	update (): void {
		this._fpsText.update();
		const ESCKey = this.input.keyboard.addKey('ESC');
		if (Phaser.Input.Keyboard.JustDown(ESCKey)) {
			this.targetEmitter.emit('UI#do_pause');
		}
		const RKey = this.input.keyboard.addKey('R');
		if (Phaser.Input.Keyboard.JustDown(RKey)) {
			this.restartScene({ isTryAgain: true });
		}
	}

}