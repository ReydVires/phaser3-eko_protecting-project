import { BaseScene } from "../objects/abstract/BaseScene";
import { PrintPointerPos, NextSceneFadeOut } from "../utils/Helper";
import { Player } from "../objects/Player";
import { DialogueData } from "./GameScene";

export class IntroScene extends BaseScene {

	private _dialogueTimeline: Array<Array<DialogueData>>;
	private _getDialogue: Array<DialogueData>;
	private _answer: string;

	private _eko: Player;
	private _nat: Phaser.GameObjects.Sprite;
	private _camera: Phaser.Cameras.Scene2D.Camera;
	private _pedagang: Phaser.GameObjects.Image;

	private _pointerCutscene: number;
	private _cutsceneTimeline: Array<(Function | Phaser.Tweens.Tween)>;

	constructor () {
		super('IntroScene');
	}

	init (): void {
		super.init();
		console.log('IntroScene active');
		this._pointerCutscene = 0;
	}

	create (): void {
		PrintPointerPos(this, true);
		this._camera = this.cameras.main;
		this._camera.setBackgroundColor(0x0984e3);

		this._dialogueTimeline = this.cache.json.get('dialogue_cutscene_intro');
		this.createDialogueSystem();

		this.add.image(0, 0, 'pemukiman_scene').setOrigin(0);
		this._pedagang = this.add.image(1520, 683, 'abang_cilok').setOrigin(0.5, 1);
		this.add.image(1520, 680, 'gerobak_cilok').setOrigin(0.5, 1);

		const eko = new Player(this, 1062, 620, 'eko_idle').setAlpha(0);
		eko.getBody().setAllowGravity(false);
		eko.play('anim_eko_idle');

		const nat = this.add.sprite(1062, 684, 'nat_idle');
		nat.setAlpha(0).setVisible(false).setOrigin(0.5, 1);

		this.createCutscene([this._camera, eko, nat]);

		this.registerEvent('picked_answer', (data: Array<any>) => {
			this._answer = data.pop()!;
			console.log('Picked:', this._answer);
			if (this._answer === 'A') {
				console.log("NEXT! Scenerio");
				this._getDialogue = <Array<DialogueData>> [
					{
						"name": "Nat",
						"text": "Hore, Eko baik deh!",
						"faceKey": "face_nat_senang"
					}
				];
				this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
					console.log('Last play cutscene!');
					this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
				});
			}
			else {
				console.log("Repeat the scenerio");
				this._getDialogue = <Array<DialogueData>> [
					{
						"name": "Nat",
						"text": "Oh, ayolah, sebentar saja!",
						"faceKey": "face_nat_kecewa"
					}
				];
				this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
					this.eventUI.emit('UI#show_question');
				});
			}
		});
	}

	private createCutscene (targets: Array<unknown>): void {
		const camera = targets[0] as Phaser.Cameras.Scene2D.Camera;
		const player: Player = targets[1] as Player;
		const nat = targets[2] as Phaser.GameObjects.Sprite;
		const baloon = this.add.image(nat.x, nat.y - 140, 'exclamation_baloon');
		baloon.setVisible(false).setActive(false).setOrigin(0, 1);

		this._cutsceneTimeline = [
			this.tweens.add({
				delay: 250,
				targets: camera,
				scrollX: '+=365',
				duration: 1700,
				ease: Phaser.Math.Easing.Sine.InOut,
				onComplete: () => {
					player.play('anim_eko_walk');
					this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
				},
			}),
			this.tweens.create({
				targets: player,
				props: {
					alpha: { getEnd: () => 1 },
					y: '+=64'
				},
				duration: 500,
				onComplete: () => {
					player.play('anim_eko_idle');
					this.eventUI.emit('event#register_dialogue');
					this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
						this.tweens.add({
							targets: camera,
							scrollX: '+=210',
							ease: Phaser.Math.Easing.Sine.InOut,
						});

						player.play('anim_eko_walk');
						this.eventUI.emit('event#enable_register_dialogue');
						this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
					});
				}
			}),
			this.tweens.create({
				targets: player,
				x: '+=323',
				duration: 1750,
				onComplete: () => {
					player.play('anim_eko_idle');
					this._pedagang.setFlipX(true);
					this.eventUI.emit('event#register_dialogue');
					this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
						this.eventUI.emit('event#enable_register_dialogue');
						this.eventUI.emit('event#register_dialogue');
						this.time.delayedCall(600, () =>
							this.eventUI.emit('UI#show_notify', this._getDialogue, () => {
								this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
							})
						);
					});
				}
			}),
			() => {
				this.eventUI.emit('event#enable_register_dialogue');
				this.eventUI.emit('event#register_dialogue');
				this.time.delayedCall(750, () => {
					this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
						this.eventUI.emit('event#enable_register_dialogue');
						this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
						// TODO: Animasi eko makan
					});
				});
			},
			() => {
				this.eventUI.emit('event#register_dialogue');
				this.time.delayedCall(750, () => {
					this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
						// TODO: Animasi eko buang sampah
						this.eventUI.emit('event#enable_register_dialogue');
						this.time.delayedCall(150, () => {
							nat.setVisible(true).play('anim_nat_idle');
							this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
						});
					});
				});
			},
			this.tweens.create({
				targets: nat,
				alpha: 1,
				duration: 180,
				onComplete: () => {
					baloon.setVisible(true).setActive(true);
					this.eventUI.emit('event#register_dialogue');
					this.time.delayedCall(200, () => {
						player.setFlipX(true);
						this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
							this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
						});
					});
					this.time.delayedCall(300, () => {
						nat.play('anim_nat_walk');
						this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
					});
				}
			}),
			this.tweens.create({
				targets: [nat, baloon],
				x: '+=64',
				duration: 750,
				onComplete: () => {
					baloon.setVisible(false);
					nat.play('anim_nat_idle');
				}
			}),
			this.tweens.create({
				onStart: () => player.play('anim_eko_walk'),
				targets: player,
				x: '-=78',
				duration: 840,
				onComplete: () => {
					player.play('anim_eko_idle');
					this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
				}
			}),
			() => {
				// TODO: Setelah buang sampah dan balik ke Nat
				this.eventUI.emit('event#enable_register_dialogue');
				this.eventUI.emit('event#register_dialogue');
				this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
					this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
				});
			},
			this.tweens.create({
				onStart: () => player.setFlipX(false).play('anim_eko_walk'),
				targets: player,
				x: '+=90',
				duration: 1050,
				onComplete: () => {
					player.play('anim_eko_idle');
					this.time.delayedCall(950, () => {
						this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
					});
				}
			}),
			this.tweens.create({
				onStart: () => player.setFlipX(true).play('anim_eko_walk'),
				targets: player,
				x: '-=115',
				duration: 1550,
				onComplete: () => {
					player.play('anim_eko_idle');
					this.excuteCutscene(this._cutsceneTimeline, ++this._pointerCutscene);
				}
			}),
			() => {
				this.eventUI.emit('event#enable_register_dialogue');
				this.eventUI.emit('event#register_dialogue');
				this.eventUI.emit('UI#show_dialogue', this._getDialogue, () => {
					this.eventUI.emit('UI#show_question');
				});
			},
			this.tweens.create({
				onStart: () => {
					player.play('anim_eko_walk');
					nat.play('anim_nat_walk').setFlipX(true);
				},
				targets: [player, nat],
				x: '-=256',
				duration: 2100,
				onComplete: () => {
					player.play('anim_eko_idle');
					nat.play('anim_nat_idle');
					this._camera.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
						this.startToScene('GameScene');
					});
					this._camera.fadeOut(300);
				}
			})
		];
	}
	
	private excuteCutscene (timelines: Array<unknown>, index: number): void {
		const currentEvent = timelines[index];
		if (currentEvent instanceof Phaser.Tweens.Tween) {
			currentEvent.play();
		}
		else if (currentEvent instanceof Function) {
			currentEvent();
		}
	}

	private createDialogueSystem (): void {
		this.registerEvent('enable_register_dialogue', () => {
			this.registerEvent('register_dialogue', () => {
				this._getDialogue = this._dialogueTimeline.shift()!;
			}, true);
		});
		this.eventUI.emit('event#enable_register_dialogue');
	}

}