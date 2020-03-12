import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../config";
import { Layer } from "../../utils/Layer";

export class VirtualJoystick extends Phaser.GameObjects.Sprite {

	private _controllerSprite: Phaser.GameObjects.Sprite;
	private _touchScreenArea: Phaser.GameObjects.Graphics;
	private _originalPosition: Phaser.Geom.Point;
	private _originalDepth: number;
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
		this._originalDepth = this.depth;
		console.assert(this.texture.frameTotal > 1, "Invalid VirtualJoystick texture: must non-single frame!");
	}

	private resetDepth (): void {
		this.setDepth(this._originalDepth);
		this._controllerSprite.setDepth(this._originalDepth);
		this._touchScreenArea.setDepth(this._originalDepth);
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
			else if (this._gameObject instanceof Phaser.GameObjects.Sprite) {
				this._gameObject.setPosition(
					this._gameObject.x + (x * dt),
					this._gameObject.y + (y * dt)
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
				this.setPosition(localX, localY);
				// Set depth dependence
				this._touchScreenArea.setDepth(Layer.UI.THIRD);
				this._controllerSprite.setDepth(Layer.UI.SECOND);
				this.setDepth(Layer.UI.SECOND);
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
				this.setPosition(this._originalPosition.x, this._originalPosition.y);
				this.resetDepth();
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
		if (this._controllerSprite) {
			this._controllerSprite.setAlpha(value);
		}
		return this;
	}

	/**
	 * @override
	 */
	public setActive (value: boolean): this {
		super.setActive(value);
		if (this._controllerSprite) {
			this._controllerSprite.setActive(value);
			if (value) {
				this._touchScreenArea.setInteractive();
			}
			else {
				this._touchScreenArea.disableInteractive();
			}
			this._touchScreenArea.setActive(value);
		}
		return this;
	}

	/**
	 * @override
	 */
	public setVisible (value: boolean): this {
		super.setVisible(value);
		if (this._controllerSprite) {
			this._controllerSprite.setVisible(value);
			this._touchScreenArea.setVisible(value);
		}
		return this;
	}

	/**
	 * @override
	 */
	public setPosition (x: number, y: number): this {
		super.setPosition(x, y);
		if (this._controllerSprite) {
			this._controllerSprite.setPosition(x, y);
		}
		return this;
	}

	/**
	 * @override
	 */
	public setScrollFactor (value: number): this {
		super.setScrollFactor(value);
		if (this._controllerSprite) {
			this._controllerSprite.setScrollFactor(value);
			this._touchScreenArea.setScrollFactor(value);
		}
		return this;
	}

}
