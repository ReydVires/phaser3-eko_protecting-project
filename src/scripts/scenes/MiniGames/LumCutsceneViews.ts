import { BaseScene } from "../../objects/abstract/BaseScene";
import { centerX, centerY } from "../../config";
import { DialogueData } from "../GameScene";
import { DialogueBox } from "../../objects/DialogueBox";
import { NextSceneFadeOut, FadeIn } from "../../utils/Helper";

export class LumCutsceneViews extends BaseScene {

	private _dialogueTimeline: Array<Array<DialogueData>>;
	private _getDialogue: Array<DialogueData>;

	constructor () {
		super('LumCutsceneViews');
	}

	init (): void {
		super.init();
		console.log('in LumCutsceneViews');
	}

	create (): void {
		this.input.enabled = false;
		const cam = this.cameras.main;
		this.add.image(centerX, centerY, 'cutscene_dolphin');
		this._dialogueTimeline = this.cache.json.get('dialogue_cutscene_lum_encounter');

		this.createDialogueSystem();

		FadeIn(this, () => {
			this.input.enabled = true;
			this.eventUI.emit('event#register_dialogue');
			this.showDialogue([this._getDialogue, () => {
				cam.on(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
					NextSceneFadeOut(this, 'TutorialGameScene');
				}).shake(350, 0.03);
			}]);
		});
	}

	private createDialogueSystem (): void {
		this.registerEvent('enable_register_dialogue', () => {
			this.registerEvent('register_dialogue', () => {
				this._getDialogue = this._dialogueTimeline.shift()!;
			}, true);
		});
		this.eventUI.emit('event#enable_register_dialogue');
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

}