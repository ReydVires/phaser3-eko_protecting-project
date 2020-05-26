import { centerX, centerY } from "../../config";
import { DialogueBox } from "../../objects/DialogueBox";

export class RandomTest extends Phaser.Scene {

	constructor () {
		super('RandomTest');
	}

	init (): void {}

	create (): void {
		const text = 'Lorem ipsum dolor sit amet!';
		const dialogue = new DialogueBox(this, centerX, centerY, '', 'Narrator', text, true);
		dialogue.setTexture('notify_message');
	}

}