enum FacingType {
	LEFT = 1,
	RIGHT = 2
}

export class BaloonSpeech extends Phaser.GameObjects.Graphics {

	private _content: Phaser.GameObjects.Text;
	private _quote: string;
	private _width: number;
	private _height: number;
	private _padding: number;
	private _arrowHeight: number;
	private _arrowFacing: FacingType; // 1: Left, 2: Right

	constructor (scene: Phaser.Scene, x: number, y: number, width: number, height: number, quote: string, arrowFacing?: FacingType) {
		super(scene, {x: x, y: y});
		scene.add.existing(this);
		this._width = width;
		this._height = height;
		this._arrowHeight = height / 4;
		this._padding = 10;
		this._arrowFacing = arrowFacing || FacingType.LEFT;
		this.setText(quote);
	}

	private createContent (): void {
		this._content = this.scene.add.text(0, 0, this._quote, {
			fontFamily: 'Arial',
			fontSize: '28px',
			color: '#000000',
			align: 'center',
			wordWrap: {
				width: this._width - (this._padding * 2)
			},
		});
		this.setContentPosition();
	}

	private setContentPosition (): void {
		const b = this._content.getBounds();
		this._content.setPosition(this.x + (this._width / 2) - (b.width / 2), this.y + (this._height / 2) - (b.height / 2));
	}

	private createBaloonStyle (): void {
		//  Bubble shadow
		this.fillStyle(0x222222, 0.5);
		this.fillRoundedRect(6, 6, this._width, this._height, 16);

		//  Bubble color
		this.fillStyle(0xffffff, 1);

		//  Bubble outline line style
		this.lineStyle(4, 0x565656, 1);

		//  Bubble shape and outline
		this.strokeRoundedRect(0, 0, this._width, this._height, 16);
		this.fillRoundedRect(0, 0, this._width, this._height, 16);
	}

	private createArrowBaloonStyle (): void {
		//  Calculate arrow coordinates
		const arrowFacing = this._arrowFacing === FacingType.LEFT ? 0 : 1;
		const multiplier = arrowFacing * this._width / this._arrowFacing;
		const point1X = Math.floor(multiplier + this._width / 7);
		const point1Y = this._height;
		const point2X = Math.floor(multiplier + (this._width / 7) * 2);
		const point2Y = this._height;
		const point3X = Math.floor(multiplier + (this._width / 7) * this._arrowFacing); // 1: arrow to Left, 2: arrow to Right
		const point3Y = Math.floor(this._height + this._arrowHeight);
		
		//  Bubble arrow shadow: in Diagonal
		this.lineStyle(4, 0x222222, 0.5);
		this.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

		//  Bubble arrow fill
		this.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
		this.lineStyle(2, 0x565656, 1);
		this.lineBetween(point2X, point2Y, point3X, point3Y);
		this.lineBetween(point1X, point1Y, point3X, point3Y);
	}

	public get width (): number {
		return this._width;
	}

	public get height (): number {
		return this._height;
	}

	public setFacing (facing: FacingType): void {
		this._arrowFacing = facing;
	}

	public setText (quote: string): void {
		// TODO: Set origin relatively to the class (currently in (0, 0))
		// TODO: Override the setX & setY method
		if (this._content) {
			this.clear();
			this._content.destroy();
		}
		this._quote = quote;
		this.createBaloonStyle();
		this.createArrowBaloonStyle();
		this.createContent();
	}

	public setBaloonSize (width: number, height: number): this {
		this._width = width > 0 ? width : 200;
		this._height = height > 0 ? height : 100;
		return this;
	}

	public setPadding (padding: number = 10): this {
		this._padding = padding;
		return this;
	}

	public clearBaloon (): this {
		console.log("Doing clear buffer!");
		this.clear();
		this._content.destroy();
		return this;
	}

	/**
	 * @override
	 */
	public setPosition (x: number, y?: number): this {
		super.setPosition(x, y);
		if (this._quote) {
			this.setText(this._quote);
		}
		return this;
	}

	/**
	 * @override
	 */
	public setDepth (value: number): this {
		super.setDepth(value);
		this._content.setDepth(value);
		return this;
	}

	/**
	 * @override
	 */
	public destroy (): any {
		this.clear();
		this._content.destroy();
		return super.destroy();
	}

} 