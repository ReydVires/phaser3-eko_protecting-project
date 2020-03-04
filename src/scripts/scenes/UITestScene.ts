//#region Import modules
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { centerX, centerY } from "../config";
import { FlatButton } from "../objects/components/FlatButton";
import { TestScene } from "./TestScene";
import { EventUIHandler } from "../utils/EventUIHandler";
import { ISceneControl } from "../objects/interface/ISceneControl";
import { DimBackground } from "../objects/components/DimBackground";

//#endregion

export class UITestScene extends Phaser.Scene implements ISceneControl {

	private _testScene: TestScene;
	private _targetEmitter: EventUIHandler;
	private _windowPause: PopUpWindow;
	private _dimBackground: DimBackground;

	constructor () {
		super('UITestScene');
	}

	init (): void {
		console.log('UITestScene');
		this._testScene = this.scene.get('TestScene') as TestScene;
		this._targetEmitter = this._testScene.eventUI();
	}

	create (): void {
		this._dimBackground = new DimBackground(this);

		const pauseBtn = new FlatButton(this, 1189, 48, 'pause_btn')
			.setScrollFactor(0)
			.setCallback(() => this._targetEmitter.emit('UI:do_pause'));

		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(() => this._targetEmitter.emit('UI:do_pause')),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
				.setCallback(() => this.startToScene('MenuScene', { isGameStarted: true }))
		])
		.setVisible(false);

		this._targetEmitter.registerEvent('UI:do_pause', this.doPause.bind(this));
	}

	doPause (): boolean {
		const isVisible = this._windowPause.visible;
		if (isVisible) {
			this._testScene.scene.resume();
		}
		else {
			this._testScene.scene.pause();
		}
		this._windowPause.setVisible(!isVisible);
		this._dimBackground.show();
		return this._windowPause.visible;
	}

	update (): void {
		const ESCKey = this.input.keyboard.addKey('ESC');
		if (Phaser.Input.Keyboard.JustDown(ESCKey)) {
			this._targetEmitter.emit('UI:do_pause');
		}
		const RKey = this.input.keyboard.addKey('R');
		if (Phaser.Input.Keyboard.JustDown(RKey)) {
			this.restartScene();
		}
	}

	startToScene (key: string, data?: object): void {
		this.scene.stop();
		this._testScene.startToScene(key, data);
	}

	restartScene (data?: object): void {
		console.clear();
		this.scene.stop();
		this._testScene.restartScene(data);
	}

}