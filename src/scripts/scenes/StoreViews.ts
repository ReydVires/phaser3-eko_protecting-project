import { centerX, centerY } from "../config";
import { DimBackground } from "../objects/components/DimBackground";
import { BaloonSpeech } from "../objects/BaloonSpeech";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";
import { BaseScene } from "../objects/abstract/BaseScene";
import { FlatButton } from "../objects/components/FlatButton";
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { NextSceneFadeOut } from "../utils/Helper";

export class StoreViews extends BaseScene {

	private _itemsContainer: Phaser.GameObjects.Container;
	private _dimBackground: DimBackground;
	private _windowBuy: PopUpWindow;
	private _canSwipe: boolean;

	constructor () {
		super('StoreViews');
	}

	init (): void {}

	create (): void {
		AndroidBackHelper.Instance.setCallbackBackButton(this.gotoMenu.bind(this));

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
			const element = new FlatButton(this, 0, 0, 'item_box_nocoin')
				.setOrigin(0, 0.5)
				.setMask(new Phaser.Display.Masks.GeometryMask(this, dbMask))
				.setCallback(() => {
					this._dimBackground.show();
					this._windowBuy.setVisible(this._dimBackground.visible);
				});
			this._itemsContainer.add(element);
			element.setX(-maskWidth * 0.5 + element.displayWidth * i + (itemSpace * i));
			element.setOrigin(0.5).setX(element.x + element.displayWidth * 0.5);
			totalWidth += element.displayWidth + itemSpace;
		}

		this._dimBackground = new DimBackground(this);
		this._windowBuy = new PopUpWindow(this, centerX, centerY, 'confirm_buy_win', [
			new FlatButton(this, 0, -12, 'yes_btn')
				.setCallback(() => {
					this._dimBackground.show();
					this._windowBuy.setVisible(false);
					this._canSwipe = true;
				}),
			new FlatButton(this, 0, 74, 'no_btn')
				.setCallback(() => {
					this._dimBackground.show();
					this._windowBuy.setVisible(false);
					this._canSwipe = true;
				})
		]).setVisible(false);

		// Scroll property
		const startTouch = new Phaser.Math.Vector2(0, 0);
		const onTouchMove = new Phaser.Math.Vector2(0, 0);
		const targetObject = new Phaser.Math.Vector2(this._itemsContainer.x, this._itemsContainer.y);

		// Threshold of scrollable
		this._canSwipe = totalWidth > maskWidth;
		const thresholdLeft = 640;
		const thresholdRight = this._canSwipe ? Math.round(thresholdLeft - (totalWidth - maskWidth)) : 0;

		this.input.on('pointerdown', (pointer: PointerEvent) => {
			if (this._canSwipe) {
				startTouch.set(pointer.x, pointer.y);
			}
		})
		.on('pointermove', (pointer: PointerEvent) => {
			if (this._canSwipe) {
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
			if (this._canSwipe) {
				// Snap feature
				this._canSwipe = false;

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
						this._canSwipe = !this._dimBackground.visible;
					}
				});
			}
		});
	}

	gotoMenu (): void {
		if (this.input.enabled) {
			if (this._dimBackground.visible) {
				this._dimBackground.show();
				this._windowBuy.setVisible(false);
			}
			else {
				NextSceneFadeOut(this, 'MenuViews', { isGameStarted: true });
				this.input.enabled = false;
			}
		}
	}

	update (): void {
		const ESCKey = this.input.keyboard.addKey('ESC');
		if (Phaser.Input.Keyboard.JustDown(ESCKey)) {
			this.gotoMenu();
		}
	}

}