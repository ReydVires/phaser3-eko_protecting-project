import { centerX, centerY } from "../config";
import { Helper } from "../utils/Helper";
import { BaloonSpeech } from "../objects/BaloonSpeech";
import { Button } from "../objects/components/Button";
import { FlatButton } from "../objects/components/FlatButton";

export class MenuScene extends Phaser.Scene {

	private _playBtn: Button;
	private _miniGameBtn: Button;
	private _warungGameBtn: Button;
	private _achievementBtn: FlatButton;
	private _settingBtn: FlatButton;

	private _baloonSpeech: BaloonSpeech;

	private _scoreBar: Phaser.GameObjects.Sprite;
	private _scoreLabel: Phaser.GameObjects.Text;
	private _score: number;

	private _isGameStart: boolean;
	private _gameTitleLabels: Array<Phaser.GameObjects.Text>;

	constructor () {
		super('MenuScene');
	}

	init (): void {
		console.log(`MenuScene`);
		this._isGameStart = false;
		this._score = 0;
		this._gameTitleLabels = [];
	}

	create (): void {
		// this.scene.start("TestScene"); // Debug
		// Helper.drawDebugLine(this.add.graphics(), { dimension: 64 });

		this._gameTitleLabels.push(
			this.add.text(centerX, centerY, "EKO",
			<Phaser.Types.GameObjects.Text.TextStyle> {
				fontFamily: 'Comfortaa',
				// color: 'black',
				fontStyle: 'bold',
				fontSize: '72px'
			}).setOrigin(0.5, 1),
			this.add.text(centerX, centerY, "PROTECTING THE ENVIRONTMENT",
			<Phaser.Types.GameObjects.Text.TextStyle> {
				fontFamily: 'Comfortaa',
				// color: 'black',
				fontSize: '48px'
			}).setOrigin(0.5, 0),
			this.add.text(centerX, centerY + 256, "TAP TO START",
			<Phaser.Types.GameObjects.Text.TextStyle> {
				fontFamily: 'Comfortaa',
				// color: 'black',
				fontStyle: 'bold',
				fontSize: '22px'
			}).setOrigin(0.5, 1)
		);

		this.input.on("pointerdown", () => {
			if (!this._isGameStart) {
				this._isGameStart = true;
				this._gameTitleLabels.forEach(label => label.setVisible(false));

				const portraitImage = this.add.image(centerX - centerX * 0.55, centerY + 32, 'phaser-logo');
				this._baloonSpeech = new BaloonSpeech(
					this,
					395, 228 - 64,
					300, 150,
					"Tahukah kamu, bahwa plastik sangat membahayakan bagi tubuh?"
				);

				this.createMenuButton();
				// this.createDisplayScore();
			}
		});
	}

	// createDisplayScore (): void {
	// 	this._scoreBar = this.add.sprite(centerX + centerX * 0.3, 64, 'ui_scorebar');
	// 	this._scoreLabel = this.add.text(
	// 		this._scoreBar.x + (this._scoreBar.displayWidth * 0.5 - 8), this._scoreBar.y + 1,
	// 		this._score.toString(),
	// 		<Phaser.Types.GameObjects.Text.TextStyle> {
	// 			color: 'black',
	// 			fontSize: '32px',
	// 			align: 'left',
	// 			fontStyle: 'bold',
	// 		})
	// 		.setOrigin(1, 0.5);
	// }

	createMenuButton (): void {
		this._playBtn = new Button(this, 1048, 334, 'AdventureButton')
			.setCallback(() => { Helper.nextSceneFadeOut(this, 'TestScene'); })
			.setJustOnce();

		this._miniGameBtn = new Button(this, 1048, 464, 'MiniGameButton')
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
			.setCallback(() => {
				this._baloonSpeech.setText("It's never been easy, right?");
			})
			.setJustOnce();
	}

	update (): void {}

}
