import { BaseScene } from "../objects/abstract/BaseScene";
import { NextSceneFadeOut, FadeIn, PrintPointerPos } from "../utils/Helper";
import { FlatButton } from "../objects/components/FlatButton";

export class WorldmapViews extends BaseScene {
	
	constructor () {
		super('WorldmapViews');
	}

	init (): void {
		super.init();
		console.log('WorldmapViews');
		this.input.enabled = false;
	}

	create (): void {
		FadeIn(this, () => { this.input.enabled = true; }, 200);
		this.add.image(0, 0, 'world_map').setOrigin(0);
		PrintPointerPos(this);

		const villageLevelBtn = new FlatButton(this, 876, 405, 'world_map_pemukiman');
		villageLevelBtn.setCallback(() => {
			this.input.enabled = false;
			NextSceneFadeOut(this, 'GameScene');
		});
	}

}