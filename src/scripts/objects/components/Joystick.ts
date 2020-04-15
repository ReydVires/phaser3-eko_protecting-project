import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../config";

export class Joystick extends Phaser.GameObjects.Sprite {

	private _controllerSprite: Phaser.GameObjects.Sprite;
	private _touchScreenArea: Phaser.GameObjects.Graphics;
	private _originalPosition: Phaser.Geom.Point;
	private _originalAlpha: number;
	private _touchStart: boolean;
	private _gameObject: any; // Physiscs Sprite or Sprite
	private _simulatedSpeed: number = 100;
	private _direction: Phaser.Geom.Point;
	private _rangeThreshold = 64;

	constructor (scene: Phaser.Scene, x: number, y: number, textures: string) {
		super(scene, x, y, textures);
		scene.add.existing(this);
		if (this.texture.frameTotal > 1) {
			this.setFrame(1); // Implement base texture
			this._controllerSprite = scene.add.sprite(x, y, textures, 0);
			this._originalPosition = new Phaser.Geom.Point(x, y);
			this._touchStart = false;
			this.initTouchListener();
		}
		console.assert(this.texture.frameTotal > 1, "Invalid VirtualJoystick texture: must non-single frame!");
	}

	private doMoveController (localX: number, localY: number): Phaser.Geom.Point {
		const direction = <Phaser.Geom.Point> {
			x: localX - this.x,
			y: localY - this.y
		};

		let magnitude = Phaser.Geom.Point.GetMagnitude(direction);
		if (magnitude > this._rangeThreshold) {
			Phaser.Geom.Point.SetMagnitude(direction, this._rangeThreshold); // Apply Normalized
		}
		return direction;
	}

	private simulateControl (direction: Phaser.Geom.Point, dt: number): void {
		if (this._gameObject && direction) {
			const x = direction.x * this._simulatedSpeed;
			const y = direction.y * this._simulatedSpeed;
			if (this._gameObject instanceof Phaser.Physics.Arcade.Sprite) {
				const newDt = dt * 50;
				this._gameObject.setVelocity(x * newDt, y * newDt);
			}
			else if (this._gameObject instanceof Phaser.GameObjects.GameObject) {
				const target = <Phaser.GameObjects.Components.Transform> (this._gameObject as unknown);
				target?.setPosition(
					target.x + (x * dt),
					target.y + (y * dt)
				);
			}
		}
	}

	private stopSimulateControl (): void {
		if (this._gameObject instanceof Phaser.Physics.Arcade.Sprite) {
			this._gameObject.setVelocity(0);
		}
		this._direction = new Phaser.Geom.Point(0);
	}

	private initTouchListener (): void {
		const range = new Phaser.Geom.Rectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		this._touchScreenArea = this.scene.add.graphics();
		this._touchScreenArea.fillStyle(0x000, 0)
			.fillRectShape(range)
			.setInteractive(range, Phaser.Geom.Rectangle.Contains)
			.on('pointerdown', (pointer: PointerEvent, localX: number, localY: number) => {
				this._touchStart = true;
				this._originalAlpha = this.alpha;
				this.setPosition(localX, localY)
					.setAlpha(0.85);
				// Reorder depth to be top
				this._touchScreenArea.setDepth(0);
			})
			.on('pointermove', (pointer: PointerEvent, localX: number, localY: number) => {
				if (this._touchStart) {
					this._direction = this.doMoveController(localX, localY);
					const position = new Phaser.Geom.Point(
						this._direction.x + this.x,
						this._direction.y + this.y
					);
					this._controllerSprite.setPosition(position.x, position.y);
				}
			})
			.on('pointerup', () => {
				this._touchStart = false;
				this.stopSimulateControl();
				this.setPosition(this._originalPosition.x, this._originalPosition.y)
					.setAlpha(this._originalAlpha);
			});
	}

	preUpdate (time: number, deltaTime: number): void {
		if (this._touchStart) {
			const dt = deltaTime / 10000;
			this.simulateControl(this._direction, dt);
		}
	}

	public setToControl (target: Phaser.GameObjects.GameObject): this {
		this._gameObject = target;
		return this;
	}

	public setSpeed (value: number): this {
		this._simulatedSpeed = value;
		return this;
	}

	/**
	 * @override
	 */
	public setAlpha (value: number): this {
		super.setAlpha(value);
		this._controllerSprite?.setAlpha(value);
		return this;
	}

	/**
	 * @override
	 */
	public setActive (value: boolean): this {
		super.setActive(value);
		this._controllerSprite?.setActive(value);
		if (value) {
			this._touchScreenArea?.setInteractive();
		}
		else {
			this._touchScreenArea?.disableInteractive();
			this.setPosition(this._originalPosition.x, this._originalPosition.y);
		}
		this._touchScreenArea?.setActive(value);
		return this;
	}

	/**
	 * @override
	 */
	public setVisible (value: boolean): this {
		super.setVisible(value);
		this._controllerSprite?.setVisible(value);
		this._touchScreenArea?.setVisible(value);
		return this;
	}

	/**
	 * @override
	 */
	public setPosition (x: number, y: number): this {
		super.setPosition(x, y);
		this._controllerSprite?.setPosition(x, y);
		return this;
	}

	/**
	 * @override
	 */
	public setScrollFactor (value: number): this {
		super.setScrollFactor(value);
		this._controllerSprite?.setScrollFactor(value);
		this._touchScreenArea?.setScrollFactor(value);
		return this;
	}

	/**
	 * @override
	 */
	public destroy (): void {
		this._controllerSprite.destroy();
		this._touchScreenArea.destroy();
		super.destroy();
	}

}
