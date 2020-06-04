import { SCREEN_WIDTH, SCREEN_HEIGHT, centerX, centerY } from "../config";

const DIALOG_TEXTURE = 'dialogue_box';

export class DialogueBox extends Phaser.GameObjects.Image {

	private _faceHolder: Phaser.GameObjects.Sprite;
	private _padding: number = 16;
	private _nameLabel: Phaser.GameObjects.BitmapText;
	private _textWidth: number;
	private _dialogueText: Phaser.GameObjects.BitmapText;
	private _interactionBlock: Phaser.GameObjects.Rectangle;
	private _callback: Function;

	constructor (scene: Phaser.Scene, x: number, y: number, faceTexture: string, name: string, text?: string, isWhite?: boolean) {
		super(scene, x, y, DIALOG_TEXTURE);
		scene.add.existing(this);
		this.setScrollFactor(0);
		this._faceHolder = this.createFaceHolder(faceTexture);
		this._textWidth = this.displayWidth - (this._faceHolder.displayWidth + this._padding * 2.5);
		this._nameLabel = this.createNameLabel(name, isWhite);
		this._dialogueText = this.createDialogueText(text, isWhite);

		this._interactionBlock = scene.add.rectangle(centerX, centerY, SCREEN_WIDTH, SCREEN_HEIGHT);
		this._interactionBlock.setFillStyle(0xfafafa, 0)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				if (typeof this._callback !== "undefined") {
					this._callback();
				}
			});
	}

	private createFaceHolder (texture: string): Phaser.GameObjects.Sprite {
		const face = this.scene.add
			.sprite(0, this.y, texture)
			.setOrigin(1, 0.5)
			.setScrollFactor(0);
		face.setX(this.x + (this.displayWidth * 0.5) - this._padding);
		if (!texture) {
			face.setVisible(false);
		}
		return face;
	}

	private createNameLabel (name: string, white?: boolean): Phaser.GameObjects.BitmapText {
		const fontKey = white ? "comfortaa_w_bold" : "comfortaa_b_bold";
		const label = this.scene.add.bitmapText(0, 0, fontKey, name)
			.setFontSize(28);
		label.setX(this.x - this.displayWidth * 0.5 + this._padding * 2);
		label.setY(this.y - this.displayHeight * 0.5 + this._padding);
		return label;
	}

	private createDialogueText (text?: string, white?: boolean): Phaser.GameObjects.BitmapText {
		text = (typeof text !== "undefined") ? text : '';
		const fontKey = white ? "comfortaa_w" : "comfortaa_b";
		const dialogue = this.scene.add.bitmapText(0, 0, fontKey, text)
			.setMaxWidth(this._textWidth)
			.setFontSize(21);
		dialogue.setX(this._nameLabel.x);
		dialogue.setY(this._nameLabel.y + this._nameLabel.height + this._padding);
		return dialogue;
	}

	public changeFace (texture: string, frame?: string | number): this {
		this._faceHolder.setTexture(texture);
		if (this._faceHolder.displayWidth < 126) {
			this._faceHolder.setDisplaySize(126, 120).setVisible(false);
		}
		if (frame) {
			this._faceHolder.setFrame(frame);
		}
		return this;
	}

	public changeFaceFrame (frame: string | number): this {
		this._faceHolder.setFrame(frame);
		return this;
	}

	public changeName (name: string): this {
		this._nameLabel.setText(name);
		return this;
	}

	public changeDialogueText (text: string): this {
		this._dialogueText.setText(text);
		return this;
	}

	public setCallback (callback: Function): this {
		this._callback = callback;
		return this;
	}

	public enableInteractive (): this {
		this._interactionBlock.setInteractive();
		return this;
	}
	
	/**
	 * @override
	 */
	disableInteractive (): this {
		this._interactionBlock.disableInteractive();
		return this;
	}

	/**
	 * @override
	 */
	setVisible (value: boolean): this {
		super.setVisible(value).setActive(value);
		this._faceHolder.setVisible(value).setActive(value);
		this._nameLabel.setVisible(value).setActive(value);
		this._dialogueText.setVisible(value).setActive(value);
		return this;
	}

	/**
	 * @override
	 */
	setY (value: number = 0): this {
		super.setY(value);
		this._faceHolder!.setY(value);
		return this;
	}

	/**
	 * @override
	 */
	destroy (): any {
		this._faceHolder!.destroy();
		this._nameLabel!.destroy();
		this._dialogueText!.destroy();
		super.destroy();
	}

}