export class ObjectiveTest extends Phaser.Scene {

	private _objectives: Map<string, boolean>;
	private _levelStatus: Phaser.GameObjects.Text;

	constructor () {
		super('ObjectiveTest');
	}

	init (): void {
		console.log('ObjectiveTest: with Map');
		/**
		 * get A -> to C
		 * get B -> to D
		 * after C & D -> Finish
		 */
		this._objectives = new Map<string, boolean>([
			["obj_a", false],
			["obj_b", false],
			["obj_c", false],
			["obj_d", false],
		]);
	}

	create (): void {
		this._levelStatus = this.add.text(512, 64, 'Locked!').setFontSize(28);

		const btnA = this.add.image(132, 132, 'phaser-logo').setTint(45311);
		btnA.setInteractive({useHandCursor: true})
			.on('pointerdown', () => this.completeObjective('obj_a', btnA));

		const btnB = this.add.image(332, 232, 'phaser-logo').setTint(65345);
		btnB.setInteractive({useHandCursor: true})
			.on('pointerdown', () => this.completeObjective('obj_b', btnB));

		const btnC = this.add.image(532, 332, 'phaser-logo').setTint(0xfff000);
		btnC.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				if (this.isObjectiveComplete('obj_a')) {
					this.completeObjective('obj_c', btnC);
				}
			});

		const btnD = this.add.image(732, 432, 'phaser-logo');
		btnD.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				if (this.isObjectiveComplete('obj_b')) {
					this.completeObjective('obj_d', btnD);
				}
			});
	}

	private isObjectiveComplete (key: string | string[]): boolean {
		if (Array.isArray(key)) {
			let trueCounter = 0;
			const len = key.length;
			for (let i = 0; i < len; i++) {
				if (this._objectives.get(key[i])) {
					trueCounter++;
				}
			}
			return trueCounter === len;
		}
		else {
			return this._objectives.has(key) && this._objectives.get(key)!;
		}
	}

	private completeObjective (key: string, gameObject?: Phaser.GameObjects.Image): void {
		if (this._objectives.has(key)) {
			this._objectives.set(key, true);
			gameObject?.setAlpha(0.35);
		}
	}

	update (): void {
		const space = this.input.keyboard.addKey('SPACE');
		if (Phaser.Input.Keyboard.JustDown(space)) {
			if (this.isObjectiveComplete(['obj_c', 'obj_d'])) {
				this._levelStatus.setText('Unlocked!');
			}
			console.log('inspect:', this._objectives);
		}
	}

}