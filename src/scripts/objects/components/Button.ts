import { ILabel } from "../interface/ILabel";

export class Button extends Phaser.GameObjects.Sprite implements ILabel {

	private _pressed: boolean = false;
	private _callback: Function;
	private _argument: unknown;
	private _unpressedTexture: string;
	private _pressedTexture: string;
	private _label: Phaser.GameObjects.Text;

	constructor (scene: Phaser.Scene, x: number, y: number, unpressedTexture: string, pressedTexture?: string) {
		super(scene, x, y, unpressedTexture);
		scene.add.existing(this);
		if (pressedTexture) {
			this._unpressedTexture = unpressedTexture;
			this.setPressedTexture(pressedTexture);
		}
		this.initInteractive();
		this.initLabel();
	}

	private initLabel (): void {
		this._label = this.scene.add.text(this.x, this.y, '', 
			<Phaser.Types.GameObjects.Text.TextStyle> {
				color: '#000',
				fontSize: '32px',
				align: 'center'
			});
		this._label.setOrigin(this.originX, this.originY);
	}

	private onDown (): void {
		if (this.texture.frameTotal > 2) {
			this.setFrame(1);
		}
		else if (this._pressedTexture) {
			this.setTexture(this._pressedTexture);
		}
		this._label?.setY(this.y + 8);
	}

	private onUp (): void {
		if (this.texture.frameTotal > 2) {
			this.setFrame(0);
		}
		else {
			this.setTexture(this._unpressedTexture);
		}
		this._label?.setY(this.y);
	}

	private onClick (): void {
		this.scene.time
			.delayedCall(25, () => {
				if (this._callback) {
					this._callback(this._argument);
				}
				else {
					console.log('Button callback is not set');
				}
			});
	}

	private initInteractive (): void {
		this.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				this._pressed = true;
				this.onDown();
			})
			.on('pointerup', () => {
				if (this._pressed) {
					this.onClick();
				}
				this.onUp();
			})
			.on('pointerout', () => {
				this._pressed = false;
				this.onUp();
			});
	}

	public getLabel(): Phaser.GameObjects.Text {
		return this._label;
	}

	public setText (text: string, style?: Phaser.Types.GameObjects.Text.TextStyle): this {
		this._label?.setText(text);
		if (style) {
			this._label?.setStyle(style);
		}
		return this;
	}

	public setCallback (callback: Function, arg?: unknown): this {
		this._argument = arg;
		this._callback = (typeof callback === 'function') ? callback :
			() => { console.log("Button default callback"); };
		return this;
	}

	public setUnpressedTexture (key: string): this {
		this._unpressedTexture = key;
		return this;
	}

	public setPressedTexture (texture: string): this {
		this._pressedTexture = texture;
		return this;
	}

	/**
	 * @override
	 */
	public setPosition (x: number, y?: number, z?: number): this {
		super.setPosition(x, y, z);
		this._label?.setPosition(x, y, z);
		return this;
	}

	/**
	 * @override
	 */
	public setVisible (value: boolean): this {
		super.setVisible(value);
		this._label?.setVisible(value);
		return this;
	}

	/**
	 * @override
	 */
	public setAlpha (value: number): this {
		super.setAlpha(value);
		this._label?.setAlpha(value);
		return this;
	}

	/**
	 * @override
	 */
	public setScale (value: number): this {
		super.setScale(value);
		this._label?.setScale(value);
		return this;
	}

	/**
	 * @override
	 */
	public setDepth (value: number): this {
		super.setScale(value);
		this._label?.setScale(value);
		return this;
	}

	/**
	 * @override
	 */
	public setScrollFactor (value: number): this {
		super.setScrollFactor(value);
		this._label?.setScrollFactor(value);
		return this;
	}

	/**
	 * @override
	 */
	public destroy (): void {
		this._label?.destroy();
		super.destroy();
	}

}