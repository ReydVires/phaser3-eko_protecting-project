import { IIdleState } from "../interface/IIdleState";
import { ILeftState } from "../interface/ILeftState";
import { IRightState } from "../interface/IRightState";
import { IJumpState } from "../interface/IJumpState";
import { IMoveable } from "../interface/IMoveable";
import { LeftState } from "./LeftState";
import { RightState } from "./RightState";
import { JumpState } from "./JumpState";

export class IdleState implements IIdleState, ILeftState, IRightState, IJumpState {

	constructor (private _target: IMoveable) {}

	doIdle(): void {
		// console.log("currently in IdleState");
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
		// console.log("change state to JumpState");
		this._target.setMoveState(new JumpState(this._target));
	}

}