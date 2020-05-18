import { PopUpWindow } from "../../objects/components/PopUpWindow";
import { centerX, centerY } from "../../config";
import { FlatButton } from "../../objects/components/FlatButton";

export class TriviaTest extends Phaser.Scene {

	private _triviaWindow: PopUpWindow;

	constructor () {
		super('TriviaTest');
	}

	init (): void {
		console.log("TriviaTest");
	}

	create (): void {
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
			this.add.text(0, 0, 'Lorem ipsum dolor sit aramet gomet euy tahu peda?', questionFontStyle).setOrigin(0.5),
			new FlatButton(this, 0, offsetY + 100 * 1.6, 'trivia_btn')
				.setCallback(() => this.triviaCallback(keyData, 'A')),
			this.add.text(0, offsetY + 100 * 1.6, 'Option A', buttonFontStyle).setOrigin(0.5),
			new FlatButton(this, 0, offsetY + 100 * 2.6, 'trivia_btn')
				.setCallback(() => this.triviaCallback(keyData, 'B')),
			this.add.text(0, offsetY + 100 * 2.6, 'Option B', buttonFontStyle).setOrigin(0.5),
			new FlatButton(this, 0, offsetY + 100 * 3.6, 'trivia_btn')
				.setCallback(() => this.triviaCallback(keyData, 'C')),
			this.add.text(0, offsetY + 100 * 3.6, 'Option C', buttonFontStyle).setOrigin(0.5),
		]);
		this._triviaWindow.setVisible(false).setActive(false);

		this.input.on('pointerdown', () => {
			if (!this._triviaWindow?.active && !this._triviaWindow.getData(keyData)) {
				this._triviaWindow.setVisible(true).setActive(true);
			}
			else {
				console.log(this._triviaWindow.getData(keyData));
			}
		});
	}

	private triviaCallback (key: string, data: string): void {
		this._triviaWindow.setData(key, data);
		console.log('You choose:', data);
		this._triviaWindow.setVisible(false).setActive(false); // Can be access later
		// this._triviaWindow.destroy();
	}

}