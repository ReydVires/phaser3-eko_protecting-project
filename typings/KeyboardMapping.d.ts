export class KeyboardAction {

    readonly isDown: boolean;
    readonly isUp: boolean;

}

export class KeyboardMapping {

    readonly RIGHT: KeyboardAction;
    readonly LEFT: KeyboardAction;
    readonly UP: KeyboardAction;
    readonly DOWN: KeyboardAction;
    readonly SPACE: KeyboardAction;

}