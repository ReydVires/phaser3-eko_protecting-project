import { BaseScene } from "../objects/abstract/BaseScene";
import { NextSceneFadeOut, FadeIn } from "../utils/Helper";
import { FlatButton } from "../objects/components/FlatButton";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";

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

		const villageLevelBtn = new FlatButton(this, 876, 405, 'world_map_pemukiman');
		villageLevelBtn.setCallback(() => {
			this.input.enabled = false;
			NextSceneFadeOut(this, 'GameScene');
		});
		this.add.image(villageLevelBtn.x, villageLevelBtn.y + villageLevelBtn.height * 0.5, 'boardname_pemukiman');

		const caveLevelBtn = this.add.image(375, 175, 'world_map_gua_lock');
		this.add.image(caveLevelBtn.x, caveLevelBtn.y + caveLevelBtn.height * 0.5, 'boardname_gua');

		const beachLevelBtn = this.add.image(313, 515, 'world_map_pantai_lock');
		this.add.image(beachLevelBtn.x, beachLevelBtn.y + beachLevelBtn.height * 0.5, 'boardname_pantai');

		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			this.startToScene('MenuViews');
		});
	}

}