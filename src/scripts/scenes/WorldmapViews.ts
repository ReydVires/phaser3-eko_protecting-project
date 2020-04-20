import { BaseScene } from "../objects/abstract/BaseScene";
import { NextSceneFadeOut, FadeIn } from "../utils/Helper";

export class WorldmapViews extends BaseScene {
	
	constructor () {
		super('WorldmapViews');
	}

	init (): void {
		super.init();
		this.input.enabled = false;
	}

	create (): void {
		FadeIn(this, () => { this.input.enabled = true; }, 200);
		this.add.image(0, 0, 'world_map').setOrigin(0);

		this.input.on('pointerup', () => {
			this.input.enabled = false;
			NextSceneFadeOut(this, 'TestScene');
		});
	}

}