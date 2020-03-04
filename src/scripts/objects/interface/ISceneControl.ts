export interface ISceneControl {

	startToScene (key: string, data?: object): void;
	restartScene (data?: object): void;
	pauseScene (): void;

}