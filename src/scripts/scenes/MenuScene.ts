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

	constructor () {
		super('MenuScene');
	}

	init (): void {
		console.log(`MenuScene`);
		this._score = 0;
	}

	create (): void {
		Helper.drawDebugLine(this.add.graphics(), 64);

		const portraitImage = this.add.image(centerX - centerX * 0.55, centerY + 32, 'phaser-logo');
		this._baloonSpeech = new BaloonSpeech(
			this,
			portraitImage.x, portraitImage.y - (portraitImage.displayHeight + 48),
			300, 150,
			"Tahukah kamu, bahwa plastik sangat membahayakan bagi tubuh?"
		);

		this.createMenuButton();
		this.createDisplayScore();
	}

	createDisplayScore (): void {
		this._scoreBar = this.add.sprite(centerX + centerX * 0.3, 64, 'ui_scorebar');
		this._scoreLabel = this.add.text(
			this._scoreBar.x + (this._scoreBar.displayWidth * 0.5 - 8), this._scoreBar.y + 1,
			this._score.toString(),
			<Phaser.Types.GameObjects.Text.TextStyle> {
				color: 'black',
				fontSize: '32px',
				align: 'left',
				fontStyle: 'bold',
			})
			.setOrigin(1, 0.5);
	}

	createMenuButton (): void {
		this._playBtn = new Button(this, centerX + centerX * 0.6, centerY, 'AdventureButton')
			.setCallback(() => { Helper.nextSceneFadeOut(this, 'TestScene'); })
			.setJustOnce();

		this._miniGameBtn = new Button(this, centerX + centerX * 0.6, this._playBtn.y + 78, 'MinigameButton')
			.setCallback(() => {
				this._score++;
				this._scoreLabel.setText(this._score.toString());
			})
			.setJustOnce();

		this._warungGameBtn = new Button(this, centerX + centerX * 0.6, this._miniGameBtn.y + 78, 'WarungButton')
			.setJustOnce();

		this._achievementBtn = new FlatButton(this, centerX + centerX * 0.6, 64, 'AchievementButton')
			.setCallback(() => {
				this._baloonSpeech.setText("What do you want? I have nothingness.");
			})
			.setJustOnce()
			.setOrigin(0.5, 0.35);

		this._settingBtn = new FlatButton(this, centerX + centerX * 0.75, 64, 'SettingButton')
			.setCallback(() => {
				this._baloonSpeech.setText("It's never been easy, right?");
			})
			.setJustOnce();
	}

	update (): void {}

}
