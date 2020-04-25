import { FlatButton } from "../objects/components/FlatButton";
import { centerX, centerY } from "../config";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";
import { BaseScene } from "../objects/abstract/BaseScene";
import { NextSceneFadeOut } from "../utils/Helper";

interface Betatester {
	name: string;
	score: number;
}

export class LeaderboardViews extends BaseScene {

	private _betaTester: Array<Betatester>;
	private _testerContainer: Phaser.GameObjects.Container;

	constructor () {
		super('LeaderboardViews');
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
			},
			<Betatester> {
				name: 'SHAWNE',
				score: 89
			},
			<Betatester> {
				name: 'FRANK',
				score: 60
			},
			<Betatester> {
				name: 'MOORE',
				score: 50
			}
		);
	}

	create (): void {
		AndroidBackHelper.Instance.setCallbackBackButton(this.goToMiniGame.bind(this));

		const leaderboardScreen = this.add.image(centerX, centerY, 'screen_leaderboard');
		new FlatButton(this, 70, 68, 'back_btn').setCallback(this.goToMiniGame.bind(this));

		// Creating mask
		const maskWidth = leaderboardScreen.displayWidth * 0.8;
		const maskHeight = leaderboardScreen.displayHeight * 0.8;
		const lbMask = this.add.graphics();
		lbMask.fillStyle(0x000, 0);
		lbMask.fillRect(centerX, centerY + 32, maskWidth, maskHeight);
		lbMask.setPosition(lbMask.x - (maskWidth * 0.5), lbMask.y - (maskHeight * 0.5));
		// everySprite.setMask(new Phaser.Display.Masks.GeometryMask(this, lbMask));

		// Scrollable here!
		let dataScoreText = `#${(1)}    ${this._betaTester[0].name}        ${this._betaTester[0].score}`;
		for (let i = 1; i < this._betaTester.length; i++) {
			const data = this._betaTester[i];
			dataScoreText += `\n\n#${(i+1)}    ${data.name}        ${data.score}`;
		}

		const testText = this.add.bitmapText(0, 0, 'comfortaa_b', dataScoreText);
		testText.setFontSize(28);
		testText.setOrigin(0.5, 0);
		testText.setMask(new Phaser.Display.Masks.GeometryMask(this, lbMask));

		this._testerContainer = this.add.container(centerX, centerY - 128);
		this._testerContainer.add(testText);

		// Scroll property
		let startTouch = new Phaser.Math.Vector2(0, 0);
		let onTouchMove = new Phaser.Math.Vector2(0, 0);
		let targetObject = new Phaser.Math.Vector2(this._testerContainer.x, this._testerContainer.y);

		// Threshold of scrollable
		const elementHeight = 77;
		const canSwipe = this._betaTester.length > 5;
		const thresholdDown = canSwipe ? (this._betaTester.length - 5) * elementHeight : 0;
		const thresholdUp = 232;

		this.input.on('pointerdown', (pointer: PointerEvent) => {
			if (canSwipe) {
				startTouch.set(pointer.x, pointer.y);
			}
		})
		.on('pointermove', (pointer: PointerEvent) => {
			if (canSwipe) {
				onTouchMove.set(pointer.x, pointer.y);
				let newY = (onTouchMove.y - startTouch.y) + targetObject.y;
				if (newY > thresholdUp) {
					newY = thresholdUp;
				}
				else if (newY < (thresholdUp - thresholdDown)) {
					newY = thresholdUp - thresholdDown;
				}
				this._testerContainer.setY(Math.round(newY));
			}
		})
		.on('pointerup', () => {
			if (canSwipe) {
				targetObject.set(this._testerContainer.x, this._testerContainer.y);
			}
		});
	}

	goToMiniGame (): void {
		if (this.input.enabled) {
			this.input.enabled = false;
			NextSceneFadeOut(this, 'MinigameViews');
		}
	}

}