import { IMoveable } from "./interface/IMoveable";
import { JumpState } from "./move_states/JumpState";
import { LeftState } from "./move_states/LeftState";
import { RightState } from "./move_states/RightState";
import { IdleState } from "./move_states/IdleState";

export class Player extends Phaser.Physics.Arcade.Sprite implements IMoveable {

	private _body: Phaser.Physics.Arcade.Body;
	private _moveState: JumpState | LeftState | RightState | IdleState;
	private _moveSpeed: number = 230;
	private _jumpHeight: number = 400;
	private _allowJump: boolean = false;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setOrigin(0.5, 1);
		this._moveState = new IdleState(this);
	}

	private isOnGround (): boolean {
		return this.body.blocked.down;
	}

	private isAllowJump (): void {
		if (this.isOnGround()) {
			this._allowJump = true;
		}
	}

	public getBody (): Phaser.Physics.Arcade.Body {
		return this._body;
	}

	public setMoveState (state: JumpState | LeftState | RightState | IdleState): void {
		this._moveState = state;
	}

	public doRight (): void {
		this.isAllowJump();
		this.setFlipX(false);
		this.setVelocityX(this._moveSpeed);
		if (this.isOnGround()) {
			this.play("anim_player_walk", true);
		}
		this._moveState.doRight();
	}

	public doLeft (): void {
		this.isAllowJump();
		this.setFlipX(true);
		this.setVelocityX(-this._moveSpeed);
		if (this.isOnGround()) {
			this.play("anim_player_walk", true);
		}
		this._moveState.doLeft();
	}

	public doIdle (): void {
		this.isAllowJump();
		this.setVelocityX(0);
		if (this.isOnGround()) {
			this.play("anim_player_idle");
		}
		this._moveState.doIdle();
	}

	public doJump (): void {
		if (this._allowJump && this.isOnGround()) {
			this._allowJump = false;
			this.setVelocityY(-this._jumpHeight);
			this.play("anim_player_jump", true);
			this._moveState.doJump();
		}
	}

}