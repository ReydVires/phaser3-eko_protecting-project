import { IEventUIHandler } from "../interface/IEventUIHandler";
import { EventUIHandler } from "../../utils/EventUIHandler";
import { ISceneControl } from "../interface/ISceneControl";

export abstract class BaseScene extends Phaser.Scene implements IEventUIHandler, ISceneControl {

	private _eventUIHandler: EventUIHandler;
	private _prefixID: string = 'event';
	private _postfixID: string = 'UIScene';

	constructor (key: string) {
		super(key);
	}

	/**
	 * @override
	 */
	init (data?: object): void {
		const keyValid = this.scene.key.length > 5;
		const regexValid = this.scene.key.indexOf('Scene') !== -1;
		const UIKey = (keyValid && regexValid) ? (this.scene.key.replace('Scene', '') + this._postfixID) : '';
		const isUISceneAvailable = this.scene.get(UIKey);
		if (isUISceneAvailable) {
			this.scene.launch(UIKey);
		}
		this._eventUIHandler = new EventUIHandler(this.events);
	}

	registerEvent (key: string, value: Function, once?: boolean): void {
		this.eventUI.registerEvent(this._prefixID + '#' + key, value, once);
	}

	startToScene (key: string, data?: object): void {
		this.eventUI.removeAllEvents();
		this.scene.start(key, data);
	}

	restartScene (data?: object): void {
		this.eventUI.removeAllEvents();
		this.scene.restart(data);
	}

	pauseScene (value: boolean = true): void {
		if (value) {
			this.scene.pause();
		}
		else {
			this.scene.resume();
		}
	}

	get eventUI (): EventUIHandler {
		return this._eventUIHandler;
	}

}