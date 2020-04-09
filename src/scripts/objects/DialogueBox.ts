import { SCREEN_WIDTH, SCREEN_HEIGHT, centerX, centerY } from "../config";

const DIALOG_TEXTURE = 'dialogue_box';

export class DialogueBox extends Phaser.GameObjects.Image {

	private _faceHolder: Phaser.GameObjects.Sprite;
	private _padding: number = 16;
	private _nameLabel: Phaser.GameObjects.Text;
	private _textWidth: number;
	private _dialogueText: Phaser.GameObjects.Text;
	private _interactionBlock: Phaser.GameObjects.Rectangle;
	private _callback: Function;

	constructor (scene: Phaser.Scene, x: number, y: number, faceTexture: string, name: string, text?: string) {
		super(scene, x, y, DIALOG_TEXTURE);
		scene.add.existing(this);
		this.setScrollFactor(0);
		this._faceHolder = this.createFaceHolder(faceTexture);
		this._textWidth = this.displayWidth - (this._faceHolder.displayWidth + this._padding * 2.5);
		this._nameLabel = this.createNameLabel(name);
		this._dialogueText = this.createDialogueText(text);

		this._interactionBlock = scene.add.rectangle(centerX, centerY, SCREEN_WIDTH, SCREEN_HEIGHT);
		this._interactionBlock.setFillStyle(0xfafafa, 0)
			.setInteractive({ useHandCursor: true })
			.on('pointerup', () => {
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
		return face;
	}

	private createNameLabel (name: string): Phaser.GameObjects.Text {
		const label = this.scene.add.text(0, 0, name)
			.setFontFamily('Comfortaa')
			.setFontSize(28)
			.setFill('0x000')
			.setFontStyle('bold');
		label.setX(this.x - this.displayWidth * 0.5 + this._padding * 2);
		label.setY(this.y - this.displayHeight * 0.5 + this._padding);
		return label;
	}

	private createDialogueText (text?: string): Phaser.GameObjects.Text {
		text = (typeof text !== "undefined") ? text : '';
		const dialogue = this.scene.add.text(0, 0, text)
			.setWordWrapWidth(this._textWidth, false)
			.setFontFamily('Comfortaa')
			.setFontSize(21)
			.setFill('0x000');
		dialogue.setX(this._nameLabel.x);
		dialogue.setY(this._nameLabel.y + this._nameLabel.height + this._padding);
		return dialogue;
	}

	public changeFace (texture: string, frame?: string | number): this {
		this._faceHolder.setTexture(texture);
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