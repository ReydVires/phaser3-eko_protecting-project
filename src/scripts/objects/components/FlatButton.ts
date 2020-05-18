export class FlatButton extends Phaser.GameObjects.Sprite {

	private _pressed: boolean = false;
	private _callback: Function;
	private _argument: unknown;
	private _pressedPos: Phaser.Math.Vector2;
	private _thresholdSwipe: number = 12;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		this.interactiveEvent();
		this._pressedPos = new Phaser.Math.Vector2(0, 0);
	}

	private onDown (pointer: PointerEvent): void {
		this._pressedPos.set(pointer.x, pointer.y);
		this._pressed = true;
	}

	private onUp (): void {
		if (this._pressed) {
			this.onClick();
		}
	}

	private onClick (): void {
		const largeRation = (this.displayWidth > 64) && (this.displayHeight > 64);
		this.scene.tweens.add({
			targets: this,
			props: {
				scale: {
					getStart: () => {
						return largeRation ? 0.93 : 0.85;
					},
					getEnd: () => 1
				}
			},
			duration: 40,
			ease: Phaser.Math.Easing.Bounce.In,
			onComplete: () => {
				if (this._callback) {
					this._callback(this._argument);
				}
				else {
					console.log('Callback is not set');
				}
			}
		});
	}

	private interactiveEvent (): void {
		this.setInteractive({ useHandCursor: true })
			.on('pointerdown', this.onDown.bind(this))
			.on('pointerup', (pointer: Phaser.Math.Vector2) => {
				const deltaPos = this._pressedPos.subtract(pointer);
				this._pressed = Math.abs(deltaPos.x) < this._thresholdSwipe;
				this.onUp();
			})
			.on('pointerout', () => {
				this._pressed = false;
				this.onUp();
			});
	}

	public setCallback (callback: Function, arg?: unknown): this {
		this._argument = arg;
		this._callback = (typeof callback === 'function') ? callback :
			() => { console.log("Default"); };
		return this;
	}

	public getArgument (): unknown {
		return this._argument;
	}

}