import { IIdleState } from "../interface/IIdleState";
import { ILeftState } from "../interface/ILeftState";
import { IRightState } from "../interface/IRightState";
import { IJumpState } from "../interface/IJumpState";
import { IMoveable } from "../interface/IMoveable";
import { IdleState } from "./IdleState";
import { LeftState } from "./LeftState";
import { JumpState } from "./JumpState";

export class RightState implements IIdleState, ILeftState, IRightState, IJumpState {

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
		// console.log("currently in RightState");
		// TODO: For animation
	}
	
	doJump(): void {
		// console.log("change state to JumpState");
		this._target.setMoveState(new JumpState(this._target));
	}

}