import { centerX, centerY, SCREEN_WIDTH } from "../config";
import { DimBackground } from "../objects/components/DimBackground";
import { BaloonSpeech } from "../objects/BaloonSpeech";
import { Helper } from "../utils/Helper";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";

export class StoreScene extends Phaser.Scene {

	private _itemsContainer: Phaser.GameObjects.Container;
	private _dimBackground: DimBackground;

	constructor () {
		super('StoreScene');
	}

	init (): void {}

	create (): void {
		AndroidBackHelper.Instance.setCallbackBackButton(() => {
			// Prevent to make double tap back
			if (this.input.enabled) {
				this.gotoMenu();
			}
		});

		const displayBox = this.add.image(centerX, centerY * 1.55, 'warung_display_box');
		const portrait = this.add.image(centerX, centerY, 'phaser-logo');
		new BaloonSpeech(
			this,
			portrait.x, (portrait.y - portrait.height),
			300, 145,
			"Lorem ipsum dolor sit aremet damet euy!"
		);

		// Creating mask
		const maskWidth = displayBox.displayWidth * 0.95;
		const maskHeight = displayBox.displayHeight * 0.6;
		const dbMask = this.add.graphics();
		dbMask.fillStyle(0x000, 0);
		dbMask.fillRect(displayBox.x, displayBox.y + 38, maskWidth, maskHeight);
		dbMask.setPosition(dbMask.x - (maskWidth * 0.5), dbMask.y - (maskHeight * 0.5));

		this._itemsContainer = this.add.container(centerX, displayBox.y + 38);
		const totalItem = 14;
		const itemSpace = 32;
		let totalWidth = 0;
		for (let i = 0; i < totalItem; i++) {
			const element = this.add.image(0, 0, 'item_box_nocoin')
				.setOrigin(0, 0.5)
				.setMask(new Phaser.Display.Masks.GeometryMask(this, dbMask));
			this._itemsContainer.add(element);
			element.setX(-maskWidth * 0.5 + element.displayWidth * i + (itemSpace * i));
			totalWidth += element.displayWidth + itemSpace;
		}

		this._dimBackground = new DimBackground(this);

		// Scroll property
		const startTouch = new Phaser.Math.Vector2(0, 0);
		const onTouchMove = new Phaser.Math.Vector2(0, 0);
		const targetObject = new Phaser.Math.Vector2(this._itemsContainer.x, this._itemsContainer.y);

		// Threshold of scrollable
		let canSwipe = totalWidth > maskWidth;
		const thresholdLeft = 640;
		const thresholdRight = canSwipe ? Math.round(thresholdLeft - (totalWidth - maskWidth)) : 0;

		this.input.on('pointerdown', (pointer: PointerEvent) => {
			if (canSwipe) {
				startTouch.set(pointer.x, pointer.y);
			}
		})
		.on('pointermove', (pointer: PointerEvent) => {
			if (canSwipe) {
				onTouchMove.set(pointer.x, pointer.y);
				let newX = (onTouchMove.x - startTouch.x) + targetObject.x;
				if (newX > thresholdLeft) {
					newX = thresholdLeft;
				}
				else if (newX < thresholdRight) {
					newX = thresholdRight;
				}
				this._itemsContainer.setX(Math.round(newX));
			}
		})
		.on('pointerup', () => {
			if (canSwipe) {
				// Snap feature
				canSwipe = false;

				const itemWidth = totalWidth / totalItem;
				const diff = this._itemsContainer.x % itemWidth;
				let snapX = 0;
				if (diff >= itemWidth / 2) {
					snapX = this._itemsContainer.x + (itemWidth - diff);
				}
				else {
					snapX = this._itemsContainer.x - diff;
				}

				snapX = this._itemsContainer.x === thresholdLeft ? thresholdLeft : snapX;
				snapX = this._itemsContainer.x === thresholdRight ? thresholdRight : snapX;

				this.tweens.add({
					targets: this._itemsContainer,
					x: snapX,
					duration: 200,
					onComplete: () => {
						targetObject.set(this._itemsContainer.x, this._itemsContainer.y);
						canSwipe = true;
					}
				});
			}
		});
	}

	gotoMenu (): void {
		Helper.nextSceneFadeOut(this, 'MenuScene', { isGameStarted: true });
		this.input.enabled = false;
	}

	update (): void {
		const ESCKey = this.input.keyboard.addKey('ESC');
		if (Phaser.Input.Keyboard.JustDown(ESCKey)) {
			if (this.input.enabled) {
				this.gotoMenu();
			}
		}
	}

}