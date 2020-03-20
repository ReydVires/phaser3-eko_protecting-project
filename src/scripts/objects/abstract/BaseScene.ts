import { IEventUIHandler } from "../interface/IEventUIHandler";
import { EventUIHandler } from "../../utils/EventUIHandler";
import { ISceneControl } from "../interface/ISceneControl";

export abstract class BaseScene extends Phaser.Scene implements IEventUIHandler, ISceneControl {

	private _eventUIHandler: EventUIHandler;
	private _prefixID: string = 'event';

	constructor (key: string) {
		super(key);
	}

	/**
	 * @override
	 */
	init (data?: object): void {
		this.scene.launch("UI" + this.scene.key);
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