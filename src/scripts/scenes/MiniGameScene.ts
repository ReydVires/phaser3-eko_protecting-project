//#region Import modules
import { centerX, centerY } from "../config";
import { Helper } from "../utils/Helper";
import { FlatButton } from "../objects/components/FlatButton";
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { DimBackground } from "../objects/components/DimBackground";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";

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
		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			console.log("Prevent to back");
		});

		this.add.bitmapText(centerX * 1.5, centerY - 128, 'simply_roundw', 'MINIGAME TIME!')
			.setOrigin(0.5, 1);
		new FlatButton(this, centerX * 1.5, centerY, 'start_btn')
			.setCallback(() => {
				this.input.enabled = false;
				Helper.nextSceneFadeOut(this, 'TutorialGameScene');
			}).setJustOnce();
		new FlatButton(this, centerX * 1.5, centerY + 120, 'leaderboard_btn')
			.setCallback(() => {
				// TODO: Implement this to leaderboard!
				// new DimBackground(this).setVisible(true);
				alert('Not implemented');
			});
	}

	update (): void {
		const ESCKey = this.input.keyboard.addKey('ESC');
		if (Phaser.Input.Keyboard.JustDown(ESCKey) && !this._goToMenuScene) {
			this._goToMenuScene = true;
			Helper.nextSceneFadeOut(this, 'MenuScene', { isGameStarted: true });
		}
	}

}