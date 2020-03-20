export interface IEventUIHandler {

	registerEvent (key: string, value: Function, once?: boolean): void;

}