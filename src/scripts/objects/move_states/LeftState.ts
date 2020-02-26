import { IIdleState } from "../interface/IIdleState";
import { ILeftState } from "../interface/ILeftState";
import { IRightState } from "../interface/IRightState";
import { IJumpState } from "../interface/IJumpState";
import { IMoveable } from "../interface/IMoveable";
import { IdleState } from "./IdleState";
import { RightState } from "./RightState";
import { JumpState } from "./JumpState";

export class LeftState implements IIdleState, ILeftState, IRightState, IJumpState {

	constructor (private _target: IMoveable) {}

	doIdle(): void {
		// console.log("change state to IdleState");
		this._target.setMoveState(new IdleState(this._target));
	}

	doLeft(): void {
		// console.log("currently in LeftState");
	}
	
	doRight(): void {
		// console.log("change state to RightState");
		this._target.setMoveState(new RightState(this._target));
	}
	
	doJump(): void {
		// console.log("change state to JumpState");
		this._target.setMoveState(new JumpState(this._target));
	}

}