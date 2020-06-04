import { UIScene } from "../objects/abstract/UIScene";
import { DialogueBox } from "../objects/DialogueBox";
import { centerX, centerY } from "../config";
import { PopUpWindow } from "../objects/components/PopUpWindow";
import { FlatButton } from "../objects/components/FlatButton";

export class IntroUIScene extends UIScene {

	private _triviaWindow: PopUpWindow;

	constructor () {
		super('IntroUIScene');
	}

	init (): void {
		super.init();
		console.log('IntroUIScene active');
	}

	create (): void {
		this.createTriviaWindow();
		this.registerEvent('show_dialogue', this.showDialogue.bind(this));
		this.registerEvent('show_notify', this.showNotification.bind(this));
	}

	private createTriviaWindow (): void {
		const question = "Nat: Pouchku ketinggalan. Kamu mau antar aku kesana kah Eko?";

		const questionFontStyle = <Phaser.Types.GameObjects.Text.TextStyle> {
			color: 'white',
			fontFamily: 'Comfortaa',
			fontSize: '28px',
			align: 'center',
			wordWrap: <Phaser.Types.GameObjects.Text.TextWordWrap> { width: 500 }
		};
		const buttonFontStyle = <Phaser.Types.GameObjects.Text.TextStyle> {
			color: 'black',
			fontFamily: 'Comfortaa',
			fontSize: '28px',
			align: 'center',
			wordWrap: <Phaser.Types.GameObjects.Text.TextWordWrap> { width: 500 }
		};
		const offsetY = 28;
		const keyData = 'user_choice';
		this._triviaWindow = new PopUpWindow(this, centerX, centerY - 120, 'trivia_question_win', [
			this.add.text(0, 0, question, questionFontStyle).setOrigin(0.5),
			new FlatButton(this, 0, offsetY + 100 * 1.6, 'trivia_btn')
				.setCallback(() => this.triviaCallback(keyData, 'A')),
			this.add.text(0, offsetY + 100 * 1.6, 'Oke, aku antar', buttonFontStyle).setOrigin(0.5),
			new FlatButton(this, 0, offsetY + 100 * 2.6, 'trivia_btn')
				.setCallback(() => this.triviaCallback(keyData, 'B')),
			this.add.text(0, offsetY + 100 * 2.6, 'Ngga mau, aku buru-buru!', buttonFontStyle).setOrigin(0.5),
		]);
		this._triviaWindow.setVisible(false).setActive(false);

		this.registerEvent('show_question', () => {
			this._triviaWindow.setVisible(true).setActive(true);
		});

		this.registerEvent('get_answer', () => {
			this.eventHandler.emit('event#picked_answer', this._triviaWindow.getData(keyData));
		});
	}

	private triviaCallback (key: string, data: string): void {
		this._triviaWindow.setData(key, data);
		this.eventHandler.emit('UI#get_answer');
		this._triviaWindow.setVisible(false).setActive(false); // Can be access later
	}

	private showDialogue (params: Array<any>): void {
		const dataDialogue = params.shift();
		if (!dataDialogue || dataDialogue.length === 0) {
			return;
		}
		const { name, text, faceKey } = dataDialogue.shift()!;
		const dialogueBox = new DialogueBox(this, centerX, 128, faceKey, name, text)
		.setCallback(() => {
			if (dataDialogue.length > 0) {
				const data = dataDialogue.shift()!;
				dialogueBox.changeName(data.name);
				dialogueBox.changeDialogueText(data.text);
				dialogueBox.changeFace(data.faceKey);
			}
			else {
				dialogueBox.setActive(false).setVisible(false);
				dialogueBox.disableInteractive().destroy();
				// Check callback after dialogue on param
				const callback = params.shift();
				if (callback && callback instanceof Function) {
					callback();
				}
			}
		});
	}

	private showNotification (params: Array<any>): void {
		const dataDialogue = params.shift();
		if (!dataDialogue || dataDialogue.length === 0) {
			return;
		}
		const { name, text } = dataDialogue.shift()!;
		const dialogueBox = new DialogueBox(this, centerX, centerY, '', name, text, true)
		.setCallback(() => {
			if (dataDialogue.length > 0) {
				const data = dataDialogue.shift()!;
				dialogueBox.changeName(data.name);
				dialogueBox.changeDialogueText(data.text);
			}
			else {
				dialogueBox.setActive(false).setVisible(false);
				dialogueBox.disableInteractive().destroy();
				// Check callback after dialogue on param
				const callback = params.shift();
				if (callback && callback instanceof Function) {
					callback();
				}
			}
		});
		dialogueBox.setTexture('notify_message');
	}

}