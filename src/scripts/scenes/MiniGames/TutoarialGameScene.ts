import { centerX, centerY } from "../../config";
import { KeyboardMapping } from "../../../../typings/KeyboardMapping";
import { BaseScene } from "../../objects/abstract/BaseScene";
import { ITouchControl } from "../../objects/interface/ITouchControl";

type ArrowStruct = {
	gameObject: Phaser.GameObjects.Sprite,
	direction: number
};

export class TutorialGameScene extends BaseScene implements ITouchControl {

	private _keys: KeyboardMapping;
	private _arrowQueue: Array<ArrowStruct>;
	private _player: Phaser.GameObjects.Sprite;
	private _directions: Array<string> = new Array<string>(
		'right_arrow', 'left_arrow', 'up_arrow'
	);

	private _testRestart: boolean;

	constructor () {
		super('TutorialGameScene');
	}

	init (): void {
		super.init();
		console.log("Welcome in TutorialGameScene");
		this._arrowQueue = new Array<ArrowStruct>();
		this._testRestart = false;
	}

	create (): void {
		this._player = this.add.sprite(centerX * 0.3, centerY * 1.3, 'phaser-logo');
		this._arrowQueue = this.createArrows(5);
		this._keys = this.input.keyboard.addKeys('RIGHT, LEFT, UP, ESC') as KeyboardMapping;
	}

	private createArrows (max: number): Array<ArrowStruct> {
		const arrows = new Array<ArrowStruct>();
		
		const pickDirection = Math.ceil(0 + Math.random() * this._directions.length - 1);
		const playerPosY = this._player.y - this._player.displayHeight * 0.6;
		const playerPosX = this._player.x - 64;
		const firstArrow = <ArrowStruct> {
			direction: pickDirection,
			gameObject: this.add.sprite(playerPosX, playerPosY, this._directions[pickDirection])
				.setAlpha(0.5)
				.setOrigin(0, 1)
		};
		arrows.push(firstArrow);

		for (let i = 1; i < max; i++) {
			const prevArrow = arrows[i - 1].gameObject;
			const pickNewDirection = Phaser.Math.RND.between(0, this._directions.length - 1);
			const arrow = <ArrowStruct> {
				direction: pickNewDirection,
				gameObject: this.add.sprite(prevArrow.x + prevArrow.displayWidth, playerPosY, this._directions[pickNewDirection])
					.setAlpha(0.5)
					.setOrigin(0, 1)
			};
			arrows.push(arrow);
		}
		return arrows;
	}

	private dequeueArrow (): ArrowStruct | undefined {
		return this._arrowQueue.shift();
	}

	private justDownKeyboard (key: Phaser.Input.Keyboard.Key): boolean {
		this.testEventRestart();
		return Phaser.Input.Keyboard.JustDown(key);
	}

	private checkTap (keyId: string): void {
		const inspectArrow = this._arrowQueue.length > 0 ? this._arrowQueue[0] : null;
		if (inspectArrow) {
			const index = inspectArrow.direction;
			const isMatch = this._directions[index].indexOf(keyId) !== -1;
			if (isMatch) {
				console.log("is Tap %s!", keyId);
				this.dequeueArrow()?.gameObject.setAlpha(1);
			}
		}
	}

	private testEventRestart (): void {
		if (this._arrowQueue.length === 0 && !this._testRestart) {
			console.log("Restart Activate!");
			this.time.delayedCall(500, () => {
				this.eventUI.emit('UI#restart');
			});
			this._testRestart = true;
		}
	}

	touchController (): void {
		// TOD: Make this method interface!

	}

	touchRightArea(): void {
		throw new Error("Method not implemented.");
	}
	
	touchLeftArea(): void {
		throw new Error("Method not implemented.");
	}
	
	touchAction(): void {
		throw new Error("Method not implemented.");
	}

	update (): void {
		// TODO: Move inventory button to mini game!
		// TODO: Timer for this
		if (this.justDownKeyboard(this._keys.RIGHT)) {
			const keyId = "right";
			this.checkTap(keyId);
		}
		else if (this.justDownKeyboard(this._keys.LEFT)) {
			const keyId = "left";
			this.checkTap(keyId);
		}
		else if (this.justDownKeyboard(this._keys.UP)) {
			const keyId = "up";
			this.checkTap(keyId);
		}

		if (this.justDownKeyboard(this._keys.ESC)) {
			this.eventUI.emit('UI#to_menu');
		}
	}

}