import { centerX, centerY } from "../config";
import { BaloonSpeech } from "../objects/BaloonSpeech";
import { Button } from "../objects/components/Button";
import { FlatButton } from "../objects/components/FlatButton";
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { DimBackground } from "../objects/components/DimBackground";
import { BaseScene } from "../objects/abstract/BaseScene";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";
import { ToggleButton } from "../objects/components/ToggleButton";
import { ExitApp, NextSceneFadeOut } from "../utils/Helper";
import { SceneData } from "./GameScene";

export class MenuViews extends BaseScene {

	private _playBtn: Button;
	private _miniGameBtn: Button;
	private _warungGameBtn: Button;
	private _achievementBtn: FlatButton;
	private _settingBtn: FlatButton;

	private _baloonSpeech: BaloonSpeech;
	private _baloonTips: Array<string>;

	private _isGameStart: boolean;
	private _titleScreen: Phaser.GameObjects.Image;
	
	private _windowExit: PopUpWindow;
	private _windowSetting: PopUpWindow;
	private _dimBackground: DimBackground;

	constructor () {
		super('MenuViews');
	}

	init (data: SceneData): void {
		super.init(data);
		console.log(`MenuViews`);
		this._isGameStart = data?.isGameStarted;
		this._baloonTips = this.cache.json.get('menu_tips');
	}

	create (): void {
		// Helper.drawDebugLine(this.add.graphics(), { dimension: 64 });
		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			if (this._isGameStart) {
				this.showExitWindow();
			}
		});

		this.add.image(0, 0, 'menu_bg').setOrigin(0);
		this._titleScreen = this.add.image(0, 0, 'screen_title').setOrigin(0);

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
			new FlatButton(this, 315, -165, 'exit_btn')
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
				.setCallback(() => { ExitApp(); }),
			new FlatButton(this, 0, 80, 'no_btn')
				.setCallback(() => this.showExitWindow())
		])
		.setVisible(false);
	}

	createGameTitle (): void {
		this._titleScreen.setVisible(false);
		const randomTipsIndex = Phaser.Math.Between(0, this._baloonTips.length - 1);
		const tip = this._baloonTips[randomTipsIndex];
		this._baloonSpeech = new BaloonSpeech(
			this,
			600, (tip.length < 94 ? 30 : 45),
			320, (tip.length < 94 ? 180 : 208),
			tip
		);
		this.createMenuButton();
	}

	createMenuButton (): void {
		this._playBtn = new Button(this, 1048, 334, 'AdventureButton')
			.setCallback(() => {
				this.input.enabled = false;
				NextSceneFadeOut(this, 'WorldmapViews');
			});

		this._miniGameBtn = new Button(this, 1048, 464, 'MiniGameButton')
			.setCallback(() => {
				this.input.enabled = false;
				NextSceneFadeOut(this, 'MinigameViews');
			});

		this._warungGameBtn = new Button(this, 1048, 574, 'WarungButton')
			.setCallback(() => {
				this.input.enabled = false;
				NextSceneFadeOut(this, 'StoreViews');
			});

		this._achievementBtn = new FlatButton(this, 1100, 64, 'achievement_btn')
			.setOrigin(0.5, 0.35);

		this._settingBtn = new FlatButton(this, 1189, 64, 'setting_btn')
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
