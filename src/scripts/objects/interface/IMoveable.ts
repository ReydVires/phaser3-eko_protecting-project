import { IdleState } from "../move_states/IdleState";
import { LeftState } from "../move_states/LeftState";
import { RightState } from "../move_states/RightState";
import { JumpState } from "../move_states/JumpState";

export interface IMoveable {

	setMoveState (state: IdleState | LeftState | RightState | JumpState): void;

}