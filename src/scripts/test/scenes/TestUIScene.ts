//#region Import modules
import { PopUpWindow } from "../../objects/components/PopUpWindow";
import { centerX, centerY } from "../../config";
import { FlatButton } from "../../objects/components/FlatButton";
import { DimBackground } from "../../objects/components/DimBackground";
import { UIScene } from "../../objects/abstract/UIScene";
import { FPSText } from "../../objects/FPSText";
import { AndroidBackHelper } from "../../utils/AndroidBackHelper";
import { DialogueBox } from "../../objects/DialogueBox";
import { FadeIn } from "../../utils/Helper";

//#endregion

export class TestUIScene extends UIScene {

	private _windowPause: PopUpWindow;
	private _gameOverWindow: PopUpWindow;
	private _dimBackground: DimBackground;
	private _fpsText: Phaser.GameObjects.BitmapText;

	constructor () {
		super('TestUIScene');
	}

	init (): void {
		super.init();
		console.log('TestUIScene');
		this.input.enabled = false;
	}

	create (): void {
		FadeIn(this, () => { 
			this.input.enabled = true;
			this.eventHandler.emit('event#allow_input');
		}, 200);
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

		const text = "Get pouch item!\n";
		const objectivesLabel = this.add.bitmapText(64, 32, 'comfortaa_w', text + '(0/1)');
		objectivesLabel.setFontSize(42).setVisible(false).setActive(false);

		const dialogueBox = new DialogueBox(this, centerX, 128, 'face_holder', 'Namae', 'Lorem ipsum dolors sits amets! Lorem ipsum dolors sits amets! Lorem ip sum dolors sits amets! Lorem ipsum dolors sits amets!')
		.setCallback(() => {
			dialogueBox.changeDialogueText("Whats done, is done! You're amazing. It's sad how less people know of this cover.");
			dialogueBox.setCallback(() => {
				dialogueBox.setVisible(false);
				dialogueBox.disableInteractive();
				this.eventHandler.emit('event#scenestate_playable');
				this.time.delayedCall(500, () => dialogueBox.destroy());
			});
		}).disableInteractive().setVisible(false);

		new FlatButton(this, 1189, 48, 'pause_btn')
			.setScrollFactor(0)
			.setCallback(() => this.eventHandler.emit('UI#do_pause'));

		this._dimBackground = new DimBackground(this);

		this._fpsText = new FPSText(this);

		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(() => this.eventHandler.emit('UI#do_pause')),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
				.setCallback(() => this.startToScene('MenuViews', {
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
		this.registerEvent('show_dialogue', () => {
			dialogueBox.enableInteractive().setVisible(true);
		}, true);
		this.registerEvent('show_objectives', () => {
			objectivesLabel.setActive(true).setVisible(true);
		}, true);
		this.registerEvent('get_objective_item', () => {
			objectivesLabel.setText(text + '(1/1)');
			console.log(text + '(1/1)');
		}, true);

		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			if (!this._dimBackground.visible) {
				this.eventHandler.emit('UI#do_pause');
			}
		});
	}

	doCameraFadeOut (onComplete: Function): void {
		this.eventHandler.emit('UI#disable_input');
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
			this.eventHandler.emit('UI#do_pause');
		}
		const RKey = this.input.keyboard.addKey('R');
		if (Phaser.Input.Keyboard.JustDown(RKey)) {
			this.restartScene({ isTryAgain: true });
		}
	}

}