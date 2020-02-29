import { PopUpWindow } from "../objects/components/PopUpWindow";
import { centerX, centerY } from "../config";
import { FlatButton } from "../objects/components/FlatButton";
import { TestScene } from "./TestScene";

export class UITestScene extends Phaser.Scene {

	private _testScene: TestScene;
	private _windowPause: PopUpWindow;

	constructor () {
		super('UITestScene');
	}

	init (): void {
		console.log('UITestScene');
	}

	create (): void {
		this._testScene = this.scene.get('TestScene') as TestScene;
		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn'),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
		])
		.setVisible(false);

		this._testScene.events.on(
			'do_pause',
			() => { this._windowPause.setVisible(!this._windowPause.visible); }
		);
	}

}