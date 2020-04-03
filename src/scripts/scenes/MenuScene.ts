import { centerX, centerY } from "../config";
import { Helper } from "../utils/Helper";
import { BaloonSpeech } from "../objects/BaloonSpeech";
import { Button } from "../objects/components/Button";
import { FlatButton } from "../objects/components/FlatButton";
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { DimBackground } from "../objects/components/DimBackground";
import { BaseScene } from "../objects/abstract/BaseScene";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";
import { ToggleButton } from "../objects/components/ToggleButton";

export class MenuScene extends BaseScene {

	private _playBtn: Button;
	private _miniGameBtn: Button;
	private _warungGameBtn: Button;
	private _achievementBtn: FlatButton;
	private _settingBtn: FlatButton;

	private _baloonSpeech: BaloonSpeech;

	private _isGameStart: boolean;
	private _gameTitleLabels: Array<Phaser.GameObjects.Text>;
	
	private _windowExit: PopUpWindow;
	private _windowSetting: PopUpWindow;
	private _dimBackground: DimBackground;

	constructor () {
		super('MenuScene');
	}

	init (data: any): void {
		super.init(data);
		console.log(`MenuScene`);
		this._isGameStart = data!.isGameStarted || false;
		this._gameTitleLabels = [];
	}

	create (): void {
		// Helper.drawDebugLine(this.add.graphics(), { dimension: 64 });
		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			if (this._isGameStart) {
				this.showExitWindow();
			}
		});

		this._gameTitleLabels.push(
			this.add.text(centerX, centerY, "EKO",
			<Phaser.Types.GameObjects.Text.TextStyle> {
				fontFamily: 'Comfortaa',
				fontStyle: 'bold',
				fontSize: '72px'
			}).setOrigin(0.5, 1),
			this.add.text(centerX, centerY, "PROTECTING THE ENVIRONTMENT",
			<Phaser.Types.GameObjects.Text.TextStyle> {
				fontFamily: 'Comfortaa',
				fontSize: '48px'
			}).setOrigin(0.5, 0),
			this.add.text(centerX, centerY + 256, "TAP TO START",
			<Phaser.Types.GameObjects.Text.TextStyle> {
				fontFamily: 'Comfortaa',
				fontStyle: 'bold',
				fontSize: '22px'
			}).setOrigin(0.5, 1)
		);

		if (this._isGameStart) {
			this.createGameTitle();
		}

		this.input.on("pointerup", () => {
			if (!this._isGameStart) {
				this._isGameStart = true;
				this.createGameTitle();
			}
		});

		this._dimBackground = new DimBackground(this);
		this.createSettingWindow();
		this.createExitWindow();
	}

	createSettingWindow (): void {
		this._windowSetting = new PopUpWindow(this, centerX, centerY, 'setting_win', [
			new FlatButton(this, 320, -170, 'exit_btn')
				.setCallback(this.showSettingWindow.bind(this)),
			new FlatButton(this, 305 * 0.6, -16, 'resetdata_btn'),
			new FlatButton(this, 305 * 0.6, 82, 'gamecredits_btn'),
			new ToggleButton(this, -305 * 0.75, 48, { active: "mute_btn", deactive: "unmute_btn" })
				.setCallback((isActive: boolean) => {
					console.log('is bgm mute active?', isActive);
				}),
			new ToggleButton(this, -305 * 0.35, 48, { active: "sfx_mute_btn", deactive: "sfx_unmute_btn" })
				.setCallback((isActive: boolean) => {
					console.log('is sfx mute active?', isActive);
				}),
		])
		.setVisible(false);
	}

	createExitWindow (): void {
		this._windowExit = new PopUpWindow(this, centerX, centerY, 'quit_win', [
			new FlatButton(this, 0, 0, 'yes_btn')
				.setCallback(() => { Helper.exitApp(); }),
			new FlatButton(this, 0, 80, 'no_btn')
				.setCallback(() => this.showExitWindow())
		])
		.setVisible(false);
	}

	createGameTitle (): void {
		this._gameTitleLabels.forEach(label => label.setVisible(false));
		const portraitImage = this.add.image(centerX - centerX * 0.55, centerY + 32, 'phaser-logo');
		this._baloonSpeech = new BaloonSpeech(
			this,
			395, 228 - 64,
			300, 150,
			"Tahukah kamu, bahwa plastik sangat membahayakan bagi tubuh?"
		);
		this.createMenuButton();
	}

	createMenuButton (): void {
		this._playBtn = new Button(this, 1048, 334, 'AdventureButton')
			.setCallback(() => {
				Helper.nextSceneFadeOut(this, 'TestScene');
			})
			.setJustOnce();

		this._miniGameBtn = new Button(this, 1048, 464, 'MiniGameButton')
			.setCallback(() => { Helper.nextSceneFadeOut(this, 'MiniGameScene'); })
			.setJustOnce();

		this._warungGameBtn = new Button(this, 1048, 574, 'WarungButton')
			.setJustOnce();

		this._achievementBtn = new FlatButton(this, 1100, 64, 'AchievementButton')
			.setCallback(() => {
				this._baloonSpeech.setText("What do you want? I have nothingness.");
			})
			.setJustOnce()
			.setOrigin(0.5, 0.35);

		this._settingBtn = new FlatButton(this, 1189, 64, 'SettingButton')
			.setCallback(this.showSettingWindow.bind(this));
	}

	showSettingWindow (): void {
		this._dimBackground.show();
		this._windowSetting.setVisible(!this._windowSetting.visible);
	}

	showExitWindow (): void {
		if (this._isGameStart && !this._windowSetting.visible) {
			const isVisible = this._windowExit.visible;
			this._dimBackground.show();
			this._windowExit.setVisible(!isVisible);
		}
	}

	update (): void {
		const ESCKey = this.input.keyboard.addKey('ESC');
		if (Phaser.Input.Keyboard.JustDown(ESCKey)) {
			this.showExitWindow();
		}
	}

}
