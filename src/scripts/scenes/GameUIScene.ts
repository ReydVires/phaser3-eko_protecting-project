import { UIScene } from "../objects/abstract/UIScene";
import { FadeIn, NextSceneFadeOut } from "../utils/Helper";
import { DimBackground } from "../objects/components/DimBackground";
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { centerX, centerY } from "../config";
import { FlatButton } from "../objects/components/FlatButton";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";
import { SceneData } from "./GameScene";

export class GameUIScene extends UIScene {

	private _overlay: DimBackground;
	private _pauseWindow: PopUpWindow;
	private _gameOverWindow: PopUpWindow;

	private _sceneData: SceneData;

	private readonly _totalObjective: number = 1;
	private _completeObjective: number;

	constructor () {
		super('GameUIScene');
	}

	init (data: object): void {
		super.init(data);
		console.log('GameUIScene');
		this.input.enabled = false;
		this._completeObjective = 0;
	}

	create (sceneData: SceneData): void {
		this._sceneData = sceneData;

		FadeIn(this, () => {
			this.input.enabled = true;
			this.eventHandler.emit('event#allow_input');
		}, 200);

		const objectiveLabel = this.createObjectiveLabel();

		this.createTouchAreaImage();

		const pauseBtn = new FlatButton(this, 1189, 48, 'pause_btn').setScrollFactor(0);
		pauseBtn.setCallback(this.doPause.bind(this));

		this._overlay = new DimBackground(this);

		this._pauseWindow = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(this.doPause.bind(this)),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
				.setCallback(() => this.startToScene('MenuViews', <SceneData> {
					isGameStarted: true,
					isTryAgain: false
				}))
		]).setVisible(false);

		this._gameOverWindow = new PopUpWindow(this, centerX, centerY, 'gameoverAdventure_win', [
			new FlatButton(this, 0, 0, 'tryagain_btn')
				.setCallback(() => this.restartScene(<SceneData> { isTryAgain: true })),
			new FlatButton(this, 0, 72, 'worldmap_btn')
				.setCallback(() => this.eventHandler.emit('UI#to_scene_worldmap'))
		]).setVisible(false);

		this.registerEvent('do_gameover', this.doGameOver.bind(this));
		this.registerEvent('show_objective', () => {
			objectiveLabel.setActive(true).setVisible(true);
		}, true);
		this.registerEvent('complete_objective', () => {
			if (this._completeObjective < this._totalObjective) {
				this._completeObjective++;
			}
			const text = `Get pouch item!\n(${this._completeObjective}/${this._totalObjective})`;
			objectiveLabel.setText(text);
		});
		this.registerEvent('to_scene_worldmap', () => {
			this.doCameraFadeOut(this.startToScene.bind(this, 'WorldmapViews'), 300);
		});
		this.registerEvent('to_scene_tutorial', () => {
			this.doCameraFadeOut(this.startToScene.bind(this, 'TutorialGameScene'));
		});

		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			if (!this._overlay.visible) {
				this.doPause();
			}
		});
	}

	private createObjectiveLabel (): Phaser.GameObjects.BitmapText {
		const text = `Get pouch item!\n(${this._completeObjective}/${this._totalObjective})`;
		const label = this.add.bitmapText(64, 32, 'comfortaa_w', text);
		label.setFontSize(42).setVisible(false).setActive(false);
		return label;
	}

	private createTouchAreaImage (): void {
		if (this._sceneData?.isTryAgain) {
			this.eventHandler.emit('event#show_hint');
		}
		else {
			const areaScreenImage = this.add.image(0, 0, 'area_screen_control');
			areaScreenImage.setOrigin(0).setAlpha(0.75);
			this.tweens.add({
				targets: areaScreenImage,
				alpha: 0,
				delay: 4750,
				duration: 1000,
				onComplete: () => {
					areaScreenImage.destroy();
					this.eventHandler.emit('event#show_hint');
				}
			});
		}
	}

	private doPause (): void {
		this._overlay.show();
		this._pauseWindow.setVisible(!this.isScenePause);
		this.pauseScene(!this.isScenePause);
	}

	private doGameOver (): void {
		this._overlay.show();
		this._gameOverWindow.setVisible(true);
		this.pauseScene();
	}

	private doCameraFadeOut (onComplete: Function, duration: number = 500): void {
		this.input.enabled = false;
		this.eventHandler.emit('event#allow_input', false);
		const cam = this.cameras.main;
		cam.once('camerafadeoutcomplete', () => onComplete());
		cam.fadeOut(duration);
	}

	update (time: number, delta: number): void {}

}