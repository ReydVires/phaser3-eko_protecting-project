//#region Import modules
import { centerX, centerY } from "../config";
import { Helper } from "../utils/Helper";
import { FlatButton } from "../objects/components/FlatButton";
import { PopUpWindow } from "../objects/components/PopUpWindow";
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
			// Prevent to make double tap back
			if (this.input.enabled) {
				Helper.nextSceneFadeOut(this, 'MenuScene', { isGameStarted: true });
				this.input.enabled = false;
			}
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
				this.input.enabled = false;
				Helper.nextSceneFadeOut(this, 'LeaderboardScene');
			}).setJustOnce();

		new PopUpWindow(this, centerX * 0.6, centerY, 'screen_booster', [
			this.add.image(-140, -112, 'booster_display'),
			this.add.image(-140, -112, 'phaser-logo').setScale(0.45), // TODO:Set content here!
			this.add.text(-40, -165, '> Game Booster A\nMinuman segar yang mampu\nmenaikan score 150%')
				.setFill('0x000')
				.setFontSize(18)
				.setFontFamily('Comfortaa'),
			this.add.sprite(-155, 120, 'booster_box', 1),
			this.add.image(-155, 120, 'phaser-logo').setScale(0.35), // TODO:Set content here!
			this.add.sprite(0, 120, 'booster_box', 1),
			this.add.image(0, 120, 'phaser-logo').setScale(0.35), // TODO:Set content here!
			this.add.sprite(155, 120, 'booster_box', 1),
			this.add.image(155, 120, 'phaser-logo').setScale(0.35), // TODO:Set content here!
		]);
	}

	update (): void {
		const ESCKey = this.input.keyboard.addKey('ESC');
		if (Phaser.Input.Keyboard.JustDown(ESCKey) && !this._goToMenuScene) {
			this.input.enabled = false;
			this._goToMenuScene = true;
			Helper.nextSceneFadeOut(this, 'MenuScene', { isGameStarted: true });
		}
	}

}