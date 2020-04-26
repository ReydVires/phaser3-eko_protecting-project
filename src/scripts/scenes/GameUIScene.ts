import { UIScene } from "../objects/abstract/UIScene";
import { FadeIn } from "../utils/Helper";

export class GameUIScene extends UIScene {

	constructor () {
		super('GameUIScene');
	}

	init (data: object): void {
		super.init(data);
		console.log('GameUIScene');
		this.input.enabled = false;
	}

	create (): void {
		FadeIn(this, () => { this.input.enabled = true; }, 200);
	}

	update (): void {}

}