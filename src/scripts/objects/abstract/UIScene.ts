import { BaseScene } from "../abstract/BaseScene";
import { EventUIHandler } from "../../utils/EventUIHandler";
import { ISceneControl } from "../interface/ISceneControl";
import { IEventUIHandler } from "../interface/IEventUIHandler";

export abstract class UIScene extends Phaser.Scene implements IEventUIHandler, ISceneControl {

	private _baseSceneKey: string;
	private _baseScene: BaseScene;
	private _prefixID: string = 'UI';
	private _isPause: boolean;

	constructor(key: string) {
		super(key);
		this._baseSceneKey = this.evaluateSceneKey(key);
		this._isPause = false;
	}

	private evaluateSceneKey (key: string): string {
		const keyValid = key.length > 3;
		const regexValid = key.indexOf(this._prefixID) === 0;
		console.assert(keyValid && regexValid, "BaseScene Key is invalid, and will not be synchronized!");
		return (keyValid && regexValid) ? key.slice(2, key.length) : key;
	}

	registerEvent(key: string, value: Function, once?: boolean | undefined): void {
		this.targetEmitter.registerEvent(this._prefixID + '#' + key, value, once);
	}

	public get targetEmitter (): EventUIHandler {
		return this._baseScene.eventUI;
	}
	
	public get isScenePause (): boolean {
		return this._isPause;
	}

	/**
	 * @override
	 */
	init (data?: object): void {
		this._baseScene = this.scene.get(this._baseSceneKey) as BaseScene;
	}

	startToScene(key: string, data?: object): void {
		this.scene.stop();
		this._baseScene.startToScene(key, data);
	}

	restartScene(data?: object): void {
		this.scene.stop();
		this._baseScene.restartScene(data);
	}

	pauseScene(value?: boolean): void {
		this._isPause = (typeof value !== 'undefined') ? value : false;
		this._baseScene.pauseScene(value);
	}

}