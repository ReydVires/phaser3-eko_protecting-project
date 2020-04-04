export class FillProgress extends Phaser.GameObjects.Graphics {

	private _xStart: number;
	private _yStart: number;
	private _width: number;
	private _height: number;
	private _percent: number;
	private _callback: Function;
	private _isCall: boolean;
	private _isStop: boolean;

	constructor (scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		super(scene);
		scene.add.existing(this);
		this._width = width;
		this._height = height;
		this._xStart = x - width * 0.5;
		this._yStart = y - height * 0.5;
		this._percent = 1;
		this._isCall = false;
		this._isStop = false;
		// Border size
		const borderOffset = 2;
		const borderRect = new Phaser.Geom.Rectangle(
			this._xStart - borderOffset,
			this._yStart - borderOffset,
			width + borderOffset * 2,
			height + borderOffset * 2
		);
		const border = scene.add.graphics({
			lineStyle: {
				width: 2,
				color: 0x636e72
			}
		});
		border.strokeRectShape(borderRect);
		// Create background bar: THIS
		const bgBar = scene.add.graphics();
		bgBar.fillStyle(0xdfe6e9, 0.95);
		bgBar.fillRect(
			this._xStart - 1,
			this._yStart - 1,
			width + borderOffset,
			height + borderOffset
		);
		bgBar.setDepth(this.depth - 0.1);

		this.resetProgress();
	}

	public setCallback (func: Function): this {
		this._isCall = false;
		this._callback = func;
		return this;
	}

	public stop (value?: boolean): boolean {
		this._isStop = value ? value : !this._isStop;
		return this._isStop;
	}

	public updateProgressbar (second: number): number {
		if (!this._isStop) {
			this.percent -= 0.0165 / second;
		}
		this.clear();
		this.fillStyle(0x34495e, 1);
		this.fillRect(this._xStart, this._yStart, this.percent * this._width, this._height);
		if (this._callback instanceof Function && !this._isCall && this.percent === 0) {
			this._callback();
			this._isCall = true;
		}
		return this.percent;
	}

	public resetProgress (value: number = 1): this {
		this._isCall = false;
		this.percent = value;
		this.clear();
		this.fillStyle(0x34495e, 1);
		this.fillRect(this._xStart, this._yStart, this.percent * this._width, this._height);
		return this;
	}
	
	public set percent (value: number) {
		if (value > 0 && value < 1) {
			this._percent = value;
		}
		else if (value <= 0) {
			this._percent = 0;
		}
		else if (value >= 1) {
			this._percent = 1;
		}
	}
	
	public get percent (): number {
		return this._percent;
	}

}