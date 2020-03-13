//#region Import modules
import { centerX, centerY } from "../config";
import { Helper } from "../utils/Helper";
import { FlatButton } from "../objects/components/FlatButton";
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { DimBackground } from "../objects/components/DimBackground";

//#endregion
export class MiniGameScene extends Phaser.Scene {

	private _goToMenuScene: boolean;

	constructor () {
		super('MiniGameScene');
	}

	init (): void {
		console.log('MiniGameScene');
		this._goToMenuScene = false;
	}

	create (): void {
		this.add.bitmapText(centerX, centerY - 128, 'simply roundw', 'MINIGAME TIME!')
			.setOrigin(0.5, 1);
		new FlatButton(this, centerX, centerY, 'start_btn')
			.setCallback(() => {
				// new DimBackground(this).setVisible(true);
				// new PopUpWindow(this, centerX, centerY, 'stageclear_win', [
				// 	new FlatButton(this, 0, 0, 'nextstage_btn'),
				// 	new FlatButton(this, 0, 72, 'worldmap_btn'),
				// ]);
				Helper.nextSceneFadeOut(this, 'TutorialGameScene');
			});
		new FlatButton(this, centerX, centerY + 120, 'leaderboard_btn');
		new FlatButton(this, centerX, centerY + 120 * 2, 'inventoryBig_btn');
	}

	update (): void {
		const ESCKey = this.input.keyboard.addKey('ESC');
		if (Phaser.Input.Keyboard.JustDown(ESCKey) && !this._goToMenuScene) {
			this._goToMenuScene = true;
			Helper.nextSceneFadeOut(this, 'MenuScene', { isGameStarted: true });
		}
	}

}