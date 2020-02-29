import { PopUpWindow } from "../objects/components/PopUpWindow";
import { centerX, centerY } from "../config";
import { FlatButton } from "../objects/components/FlatButton";
import { TestScene } from "./TestScene";
import { EventUIHandler } from "../objects/misc/EventUIHandler";

export class UITestScene extends Phaser.Scene {

	private _testSceneHandler: EventUIHandler;
	private _windowPause: PopUpWindow;

	constructor () {
		super('UITestScene');
	}

	init (): void {
		console.log('UITestScene');
		this._testSceneHandler = (this.scene.get('TestScene') as TestScene).eventUI();
		this._testSceneHandler.registerEvent('event:test3', () => {
			console.log("This event installed in UITestScene");
		}, true);
	}

	create (): void {
		this._testSceneHandler.emit('event:test2');
		this._testSceneHandler.emit('event:test1');
		this._testSceneHandler.emit('event:test');
		this._testSceneHandler.emit('event:test2');
		this._testSceneHandler.emit('event:test1');
		this._testSceneHandler.inspectEvents();

		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(() => {
					this._testSceneHandler.emit('do_dim_background'); // TODO: Fix this!
					this._windowPause.setVisible(!this._windowPause.visible);
				}),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
		])
		.setVisible(false);

		// this._testScene.events.on(
		// 	'do_pause',
		// 	() => { this._windowPause.setVisible(!this._windowPause.visible); }
		// );
	}

}