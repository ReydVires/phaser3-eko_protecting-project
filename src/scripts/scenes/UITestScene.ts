import { PopUpWindow } from "../objects/components/PopUpWindow";
import { centerX, centerY } from "../config";
import { FlatButton } from "../objects/components/FlatButton";
import { TestScene } from "./TestScene";
import { EventUIHandler } from "../utils/EventUIHandler";

export class UITestScene extends Phaser.Scene {

	private _testScene: TestScene;
	private _targetEmitter: EventUIHandler;
	private _windowPause: PopUpWindow;

	constructor () {
		super('UITestScene');
	}

	init (): void {
		console.log('UITestScene');
		this._testScene = this.scene.get('TestScene') as TestScene;
		this._targetEmitter = this._testScene.eventUI();
	}

	create (): void {
		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(() => {
					// TODO: Concrete implementation of event: & UI:
					this._testScene.events.emit('do_dim_background');
					this._targetEmitter.emit('do_pause');
				}),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
		])
		.setVisible(false);

		this._targetEmitter.registerEvent(
			'do_pause',
			() => { this._windowPause.setVisible(!this._windowPause.visible); }
		);
	}

	update (): void {
		const spaceKey = this.input.keyboard.addKey('SPACE');
		if (Phaser.Input.Keyboard.JustUp(spaceKey)) {
			if (this._testScene.scene.isPaused()) {
				this._testScene.scene.resume();
			}
		}
	}

}