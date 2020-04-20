import { BaseScene } from "../objects/abstract/BaseScene";
import { NextSceneFadeOut } from "../utils/Helper";

export class WorldmapViews extends BaseScene {
	
	constructor () {
		super('WorldmapViews');
	}

	init (): void {
		super.init();
	}

	create (): void {
		this.add.image(0, 0, 'world_map').setOrigin(0);
		this.input.on('pointerup', () => {
			this.input.enabled = false;
			NextSceneFadeOut(this, 'TestScene');
		});
	}

}