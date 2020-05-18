import { DialogueBox } from "../../objects/DialogueBox";
import { centerX, RIGHT_AREA } from "../../config";

export class DialogueTest extends Phaser.Scene {

	private _dialogueBox: DialogueBox;

	constructor () {
		super('DialogueTest');
	}

	init (): void {
		console.log('DialogueTest');
	}

	create (): void {
		this.createInputHandler();
		const dialogueTimeline = [
			{
				name: "Eko",
				text: "Nat! Sudah ketemu belum?",
				faceKey: "face_holder"
			},
			{
				name: "Nat",
				text: "Belum!",
				faceKey: "face_holder"
			},
			{
				name: "Eko",
				text: "Aku bantu deh ya!",
				faceKey: "face_holder"
			},
		];

		this.events.once('show', () => {
			const { faceKey, name, text } = dialogueTimeline.shift()!;
			this._dialogueBox = new DialogueBox(this, centerX, 128, faceKey, name, text);
			this._dialogueBox.setCallback(() => {
				if (dialogueTimeline.length > 0) {
					const data = dialogueTimeline.shift()!;
					this._dialogueBox.changeName(data.name);
					this._dialogueBox.changeDialogueText(data.text);
					this._dialogueBox.changeFace(data.faceKey);
				}
				else {
					this._dialogueBox.setActive(false).setVisible(false);
					this._dialogueBox.disableInteractive().destroy();
				}
			});
		});
	}

	private createInputHandler (): void {
		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			if (this.input.pointer1.noButtonDown()) {
				this.events.emit('show');
			}
		});
	}

}