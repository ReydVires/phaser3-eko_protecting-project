import { FlatButton } from "../objects/components/FlatButton";
import { centerX, centerY } from "../config";
import { Helper } from "../utils/Helper";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";

interface Betatester {
	name: string;
	score: number;
}

export class LeaderboardScene extends Phaser.Scene {

	private _betaTester: Array<Betatester>;
	private _testerContainer: Phaser.GameObjects.Container;

	constructor () {
		super('LeaderboardScene');
	}

	init (): void {
		this._betaTester = new Array<Betatester>(
			<Betatester> {
				name: 'HIGGINS',
				score: 2000
			},
			<Betatester> {
				name: 'GRIMORY',
				score: 1000
			},
			<Betatester> {
				name: 'SAMS',
				score: 999
			},
			<Betatester> {
				name: 'RUDOLFO',
				score: 200
			},
			<Betatester> {
				name: 'POTTERS',
				score: 100
			}
		);
	}

	create (): void {
		AndroidBackHelper.Instance.setCallbackBackButton(this.goToMiniGame.bind(this));

		const leaderboardScreen = this.add.image(centerX, centerY, 'screen_leaderboard');
		new FlatButton(this, 70, 68, 'back_btn')
			.setCallback(this.goToMiniGame.bind(this))
			.setJustOnce();

		// Creating mask
		const maskWidth = leaderboardScreen.displayWidth * 0.8;
		const maskHeight = leaderboardScreen.displayHeight * 0.8;
		const lbMask = this.add.graphics();
		lbMask.fillStyle(0x000, 0);
		lbMask.fillRect(centerX, centerY + 32, maskWidth, maskHeight);
		lbMask.setPosition(lbMask.x - (maskWidth * 0.5), lbMask.y - (maskHeight * 0.5));
		// everySprite.setMask(new Phaser.Display.Masks.GeometryMask(this, lbMask));

		// Scrollable
		let dataScoreText = `#${(1)}    ${this._betaTester[0].name}        ${this._betaTester[0].score}`;
		for (let i = 1; i < this._betaTester.length; i++) {
			const data = this._betaTester[i];
			dataScoreText += `\n#${(i+1)}    ${data.name}        ${data.score}`;
		}
		const testText = this.add.text(0, 0, dataScoreText, { color: 'black' })
			.setFontFamily('Comfortaa')
			.setFontSize(28)
			.setLineSpacing(40)
			.setOrigin(0.5, 0);
		console.log('testText height', testText.displayHeight);
		testText.setMask(new Phaser.Display.Masks.GeometryMask(this, lbMask));
		this._testerContainer = this.add.container(centerX, centerY - 128);
		this._testerContainer.add(testText);

		let startTouch = new Phaser.Math.Vector2(0, 0);
		let onTouchMove = new Phaser.Math.Vector2(0, 0);
		let targetObject = new Phaser.Math.Vector2(this._testerContainer.x, this._testerContainer.y);
		this.input.on('pointerdown', (pointer: PointerEvent) => {
			startTouch = new Phaser.Math.Vector2(pointer.x, pointer.y);
		})
		.on('pointermove', (pointer: PointerEvent) => {
			onTouchMove = new Phaser.Math.Vector2(pointer.x, pointer.y);
			let newY = (onTouchMove.y - startTouch.y) + targetObject.y;
			newY = newY < 232 ? newY : 232;
			newY = testText.displayHeight - newY < 165 ? newY : 165;
			this._testerContainer.setY(Math.round(newY));
		})
		.on('pointerup', () => {
			targetObject = new Phaser.Math.Vector2(this._testerContainer.x, this._testerContainer.y);
		});
	}

	goToMiniGame (): void {
		this.input.enabled = false;
		Helper.nextSceneFadeOut(this, 'MiniGameScene');
	}

}