import { IJumpState } from "../interface/IJumpState";
import { ILeftState } from "../interface/ILeftState";
import { IIdleState } from "../interface/IIdleState";
import { IRightState } from "../interface/IRightState";
import { IMoveable } from "../interface/IMoveable";
import { IdleState } from "./IdleState";
import { LeftState } from "./LeftState";
import { RightState } from "./RightState";

export class JumpState implements IIdleState, ILeftState, IRightState, IJumpState {

	constructor (private _target: IMoveable) {}

	doIdle(): void {
		// console.log("change state to IdleState");
		this._target.setMoveState(new IdleState(this._target));
	}

	doLeft(): void {
		// console.log("change state to LeftState");
		this._target.setMoveState(new LeftState(this._target));
	}

	doRight(): void {
		// console.log("change state to RightState");
		this._target.setMoveState(new RightState(this._target));
	}

	doJump(): void {
		// console.log("currently in JumpState");
	}

}