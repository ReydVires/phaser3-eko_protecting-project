import { IMoveable } from "./interface/IMoveable";
import { JumpState } from "./move_states/JumpState";
import { LeftState } from "./move_states/LeftState";
import { RightState } from "./move_states/RightState";
import { IdleState } from "./move_states/IdleState";
import { PhysicSprite } from "./abstract/PhysicSprite";

export class Player extends PhysicSprite implements IMoveable {

	private _moveState: JumpState | LeftState | RightState | IdleState;
	private _moveSpeed: number = 230;
	private _jumpHeight: number = 400;
	private _allowJump: boolean = false;
	private _allowDoubleJump: boolean = true;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		this.setOrigin(0.5, 1);
		this._moveState = new IdleState(this);
	}

	private isOnGround (): boolean {
		return this.body.blocked.down;
	}

	private isAllowJump (): void {
		if (this.isOnGround()) {
			this._allowJump = true;
			this._allowDoubleJump = true;
		}
	}

	public setMoveState (state: JumpState | LeftState | RightState | IdleState): void {
		this._moveState = state;
	}

	public movementSystem (): void {
		if (this.isOnGround()) {
			if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
				this._moveState.doIdle();
			}
			else {
				if (this.body.velocity.x > 0 && this.body.velocity.y === 0) {
					this._moveState.doRight();
					this._allowJump = true;
					this._allowDoubleJump = true;
				}
				else if (this.body.velocity.x < 0 && this.body.velocity.y === 0) {
					this._moveState.doLeft();
					this._allowJump = true;
					this._allowDoubleJump = true;
				}
			}
			if (this.body.velocity.y !== 0) {
				this._moveState.doJump();
			}
		}
		else {
			const lastVelocityY = this.body.velocity.y;
			const isFalling = this.body.velocity.y - lastVelocityY < lastVelocityY;
			if (isFalling) {
				this._moveState.doIdle();
			}
			else {
				this._moveState.doJump();
			}
		}

		// Animation state
		if (this._moveState instanceof IdleState) {
			this.play("anim_player_idle");
		}
		else if (this._moveState instanceof JumpState) {
			this.play("anim_player_jump", true);
		}
		else if (this._moveState instanceof LeftState || this._moveState instanceof RightState) {
			this.play("anim_player_walk", true);
		}
	}

	public doRight (): void {
		this.isAllowJump();
		this.setFlipX(false);
		this.setVelocityX(this._moveSpeed);
	}

	public doLeft (): void {
		this.isAllowJump();
		this.setFlipX(true);
		this.setVelocityX(-this._moveSpeed);
	}

	public doIdle (): void {
		this.isAllowJump();
		this.setVelocityX(0);
	}

	public doJump (): void {
		if (this._allowJump && this.isOnGround()) {
			this._allowJump = false;
			this.setVelocityY(-this._jumpHeight);
		}
		else if (this._allowDoubleJump && !this.isOnGround()) {
			this.setVelocityY(-this._jumpHeight * 0.80);
			this._allowDoubleJump = false;
		}
	}

}