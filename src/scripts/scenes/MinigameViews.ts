//#region Import modules
import { centerX, centerY } from "../config";
import { FlatButton } from "../objects/components/FlatButton";
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";
import { BaseScene } from "../objects/abstract/BaseScene";
import { NextSceneFadeOut } from "../utils/Helper";

//#endregion
export class MinigameViews extends BaseScene {

	private _goToMenuScene: boolean;

	constructor () {
		super('MinigameViews');
	}

	init (): void {
		super.init();
		console.log('MinigameViews');
		this._goToMenuScene = false;
	}

	create (): void {
		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			// Prevent to make double tap back
			if (this.input.enabled) {
				NextSceneFadeOut(this, 'MenuViews', { isGameStarted: true });
				this.input.enabled = false;
			}
		});

		this.add.bitmapText(centerX * 1.5, centerY - 128, 'simply_roundw', 'MINIGAME TIME!')
			.setOrigin(0.5, 1);
		new FlatButton(this, centerX * 1.5, centerY, 'start_btn')
			.setCallback(() => {
				this.input.enabled = false;
				NextSceneFadeOut(this, 'TutorialGameScene');
			});
		new FlatButton(this, centerX * 1.5, centerY + 120, 'leaderboard_btn')
			.setCallback(() => {
				this.input.enabled = false;
				NextSceneFadeOut(this, 'LeaderboardViews');
			});

		new PopUpWindow(this, centerX * 0.6, centerY, 'screen_booster', [
			this.add.image(-140, -112, 'booster_display'),
			this.add.image(-140, -112, 'phaser-logo').setScale(0.45), // TODO:Set content here!
			this.add.bitmapText(-40, -165, 'comfortaa_b', '> Game Booster A\nMinuman segar yang mampu\nmenaikan score 150%')
				.setFontSize(18),
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
			NextSceneFadeOut(this, 'MenuViews', { isGameStarted: true });
		}
	}

}