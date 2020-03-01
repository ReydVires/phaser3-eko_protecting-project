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
		this._targetEmitter.registerEvent('event:test3', () => {
			console.log("Call the event that installed in UITestScene");
		});
	}

	create (): void {
		this._targetEmitter.emit('event:test2');
		this._targetEmitter.emit('event:test1');
		this._targetEmitter.emit('event:test');
		this._targetEmitter.emit('event:test2');
		this._targetEmitter.emit('event:test1');
		this._targetEmitter.inspectEvents();

		this._windowPause = new PopUpWindow(this, centerX, centerY, 'gamepaused_win', [
			new FlatButton(this, 0, 0, 'continue_btn')
				.setCallback(() => {
					// TODO: Concrete implementation of event: & UI:
					this._targetEmitter.emit('do_dim_background');
					this._windowPause.setVisible(!this._windowPause.visible);
					// if (!this._testScene.scene.isPaused()) {
					// 	this._testScene.scene.pause();
					// }
					// else {
					// 	this._testScene.scene.resume();
					// }
				}),
			new FlatButton(this, 0, 80, 'backtomainmenu_btn')
		])
		.setVisible(false);

		// this._testScene.events.on(
		// 	'do_pause',
		// 	() => { this._windowPause.setVisible(!this._windowPause.visible); }
		// );
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