import { BaseScene } from '../objects/abstract/BaseScene';
import { Player } from '../objects/Player';
import { KeyboardMapping } from '../../../typings/KeyboardMapping';
import { Tile } from '../objects/Tile';
import { Coin } from '../objects/collectable/Coin';
import { ObjectiveItem } from '../objects/collectable/ObjectiveItem';
import { OnExitOverlap } from '../utils/PhysicsHelper';
import { BaloonSpeech } from '../objects/BaloonSpeech';
import { PrintPointerPos, IsInDevelopment } from '../utils/Helper';
import { LEFT_AREA, RIGHT_AREA, SCREEN_HEIGHT } from '../config';

type GameObjectTransform = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform;

type DialogueData = {
	text: string,
	name: string,
	faceKey: string
};

enum GameState {
	Playable,
	Cutscene,
	Dialogue
}

export type SceneData = {
	isTryAgain: boolean,
	isGameStarted: boolean
};

export class GameScene extends BaseScene {

	private _player: Player;
	private _playerInteractWith: Phaser.GameObjects.GameObject;

	private _camera: Phaser.Cameras.Scene2D.Camera;
	private _deadAreaY: number;
	private _gameState: GameState;

	private _portalGroup: Phaser.Physics.Arcade.Group;

	private _boundsGroup: Phaser.Physics.Arcade.Group;

	private _dialogueTimeline: Array<Array<DialogueData>>;

	private _npcDialogue: Array<DialogueData>;
	private _baloonSpeech: BaloonSpeech;

	private _onInteraction: boolean;
	private _onMove: boolean;

	constructor () {
		super('GameScene');
	}

	init (data: object): void {
		super.init(data);
		console.log("GameScene");
		this.input.enabled = false;
		this._gameState = GameState.Playable;
		this._portalGroup = this.physics.add.group({ allowGravity: false });
		this._onInteraction = false;
		this._onMove = false;
	}

	create (sceneData: SceneData): void {
		const background = this.createBackgrounds();

		PrintPointerPos(this, true);
		
		this._camera = this.cameras.main;
		// Set bound camera, based on background level
		this._camera.setBounds(0, 0, background.displayWidth - 32, 0);

		this._deadAreaY = this._camera.y + this._camera.height;

		this._player = new Player(this, 128, 575, 'eko_idle').setDepth(1);
		this._camera.startFollow(this._player);

		this.gameParamProcess(sceneData);

		this.createObjectiveBounds();

		const npcObject = this.createNPC();
		this._dialogueTimeline = new Array<Array<DialogueData>>(
			[
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
			],
			[
				{
					name: "Nat",
					text: 'Wahh, Eko! Terimakasih banyak! Akhirnya ketemu juga!',
					faceKey: 'face_holder'
				},
				{
					name: 'Nat',
					text: 'Apa kamu mau balik sekarang?',
					faceKey: 'face_holder'
				},
				{
					name: 'Eko',
					text: 'Ada yang aneh dengan gua ini, aku mau jelajah lebih jauh lagi dulu',
					faceKey: 'face_holder'
				},
				{
					name: 'Nat',
					text: 'Ah, oke. Aku tunggu ya',
					faceKey: 'face_holder'
				}
			],
			[
				{
					name: 'Nat',
					text: 'Wah, apa ini?',
					faceKey: 'face_holder'
				},
				{
					text: 'Aku engga tahu, tapi ini cantik sekali',
					name: 'Eko',
					faceKey: 'face_holder'
				},
				{
					name: 'Nat',
					text: 'Iya, kamu benar, mungkin ini bisa membuka sesuatu?',
					faceKey: 'face_holder'
				},
				{
					text: 'Eh, apasih, seperti di film-film fantasi itu ya?',
					name: 'Eko',
					faceKey: 'face_holder'
				},
				{
					name: 'Nat',
					text: 'Dicoba aja! Pergi ke tempat paling jauh, siapa tahu benda ini akan bereaksi!',
					faceKey: 'face_holder'
				},
				{
					text: 'Oke',
					name: 'Eko',
					faceKey: 'face_holder'
				},
			],
			[
				{
					text: 'Ah!',
					name: 'Eko',
					faceKey: 'face_holder'
				},
				{
					name: 'Nat',
					text: 'Eko!',
					faceKey: 'face_holder'
				},
				{
					text: 'Ada gua terbuka...',
					name: 'Eko',
					faceKey: 'face_holder'
				},
				{
					name: 'Nat',
					text: 'Berbahaya, lebih baik kita keluar dari sini!',
					faceKey: 'face_holder'
				},
				{
					text: 'Ayo masuk!',
					name: 'Eko',
					faceKey: 'face_holder'
				}
			]
		);
		this.createDialogueSystem(npcObject);

		const levelData = this.cache.json.get('tutorial_data_level');
		const mappingData = levelData!.mappingData;
		this.createMap(mappingData);

		this.createLeftBoundary();

		this.createInputHandler();

		const hintObjects = this.createHint();
		this.registerEvent('show_hint', () => {
			hintObjects.forEach(gameObject => gameObject.setActive(true).setVisible(true));
		}, true);

		this.registerEvent('allow_input', (data: unknown) => {
			if (Array.isArray(data)) {
				this.input.enabled = data.length > 0 ? data.pop() : true;
			}
		});

		this.onDevelopmentMethod();
	}

	private createBackgrounds (): Phaser.GameObjects.Image {
		const bg = this.add.image(0, 0, 'tutorial_stage_bg').setOrigin(0);
		this.add.image(0, 0, 'tutorial_stage_platform_p1').setOrigin(0).setScrollFactor(0.9);
		this.add.image(0, 0, 'tutorial_stage_platform').setOrigin(0);
		this.add.image(0, 0, 'tutorial_stage_foreground').setOrigin(0).setScrollFactor(0.95);
		this.add.image(1725, 625, 'cave_entrance').setOrigin(0, 1);
		return bg;
	}

	private gameParamProcess(sceneData: SceneData): void {
		if (sceneData?.isTryAgain) {
			this.tweens.add({
				targets: this._player,
				props: {
					alpha: {
						getStart: () => 0,
						getEnd: () => 1
					}
				},
				duration: 120,
				ease: 'Linear',
				repeat: 4
			});
		}
	}

	private createObjectiveBounds (): void {
		this._boundsGroup = this.physics.add.group({
			allowGravity: false,
			immovable: true
		});

		const boundsData = [
			this.add.zone(935, 330, 16, 256).setName('talk_to_npc'),
			this.add.zone(1470, 210, 16, 128).setName('get_pouch_item'),
		];
		for (let i = 0; i < boundsData.length; i++) {
			this._boundsGroup.add(boundsData[i]);
		}

		this.physics.world.enable(this._boundsGroup);
		
		const boundsCollider = this.physics.add.collider(this._player, this._boundsGroup, (player, child) => {
			if (this._boundsGroup.countActive() === 0) {
				boundsCollider.destroy();
			}
		});
	}

	private completeObjectiveBound (name: string): void {
		this._boundsGroup.getChildren().forEach((child) => {
			if (child.name === name) {
				child.destroy();
			}
		});
		if (name === 'next_stage') {
			this.eventUI.emit('UI#to_scene_tutorial');
		}
		else if (name === 'talk_to_npc') {
			this.eventUI.emit('UI#show_objective');
			this.eventUI.emit('event#enable_register_dialogue');
		}
		else if (name === 'get_pouch_item') {
			this.eventUI.emit('UI#complete_objective');
		}
	}

	private createNPC (): Phaser.GameObjects.Sprite {
		const npc = this.physics.add.sprite(950, 574, 'lady_npc');
		npc.setOrigin(0.5, 1).setName('NPC');
		(npc.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

		// Register collider
		this.physics.add.overlap(this._player, npc, (player, npc) => {
			this._playerInteractWith = npc.setActive(true);
		});
		return npc;
	}

	private createDialogueSystem (npcObject: GameObjectTransform): void {
		this.registerEvent('npc_dialogue', (data: any) => {
			let objective: string = '';
			if (Array.isArray(data)) {
				objective = data.pop();
			}
			const dialogue = this._npcDialogue.shift();
			if (dialogue) {
				this._gameState = GameState.Dialogue;
				if (this._baloonSpeech?.active) {
					this._baloonSpeech.destroy();
				}
				const quote = dialogue!.text;
				const gameObject = dialogue!.target;
				const facing = dialogue!.facing;
				this._baloonSpeech = new BaloonSpeech(
					this, 0, 0, 250, 120, quote, facing
				);
				this._baloonSpeech.setPosition(
					gameObject.x - this._baloonSpeech.width,
					gameObject.y - this._baloonSpeech.height * 2.5
				);
				this._baloonSpeech.setDepth(1);
			}
			else if (this._baloonSpeech?.active) {
				this._baloonSpeech.destroy();
				const npcBody = (npcObject.body as Phaser.Physics.Arcade.Body);
				npcBody.checkCollision.none = true;
				if (objective) {
					this.completeObjectiveBound(objective);
				}
				this._gameState = GameState.Playable;
			}
		});

		this.registerEvent('enable_register_dialogue', () => {
			this.registerEvent('register_dialogue', () => {
				this._npcDialogue = this._dialogueTimeline.shift()!;
			}, true);
		});
		this.eventUI.emit('event#enable_register_dialogue');
	}

	private createMap (mapData: Array<string>): void {
		const maxLength = mapData.length;
		const tileGroup = this.physics.add.staticGroup({ classType: Tile });
		const coinGroup = this.physics.add.group({
			classType: Coin,
			allowGravity: false
		});
		const itemsGroup = this.physics.add.group({
			classType: ObjectiveItem,
			allowGravity: false
		});

		for (let i = 0; i < maxLength; i++) {
			const row = mapData[i].length;
			for (let j = 0; j < row; j++) {
				switch (mapData[i][j]) {
					case 'o':
						const platform = new Tile(this, 64 * j, 64 * i, '');
						tileGroup.add(platform);
						platform.setDisplaySize(64, 64);
						platform.refreshBody();
						break;
					case 'c':
						const coin = new Coin(this, 64 * j, 64 * i, 'coin_game').setOrigin(0, 0.3);
						coin.play('anim_coin_game');
						coinGroup.add(coin);
						break;
					case 'p':
						const zone = this.add.zone(j * 64, i * 64, 64, 64).setOrigin(0);
						this._portalGroup.add(zone);
						(zone.body as Phaser.Physics.Arcade.Body).setEnable();
						break;
					case 'i':
						const item = new ObjectiveItem(this, j * 64, i * 64, 'item_random', '0001');
						itemsGroup.add(item);
						item.setName('Pouch');
						item.setOrigin(0);
						break;
					default:
						const key = mapData[i][j];
						if (key !== ' ' && key !== 'x') {
							console.log(key + ' is not handle');
						}
						break;
				}
			}
		}

		// Register colliders
		this.physics.add.collider(this._player, tileGroup);
		const coinCollider = this.physics.add.overlap(this._player, coinGroup, (player, child) => {
			const coin = child as Coin;
			console.log("Collecting coin:", coin.collect());
			if (coinGroup.countActive() === 0) {
				coinCollider.destroy();
			}
		});
		this.physics.add.overlap(this._player, itemsGroup, (player, child) => {
			const item = child as ObjectiveItem;
			this._playerInteractWith = item.setActive(true);
		});
		this.physics.add.overlap(this._player, this._portalGroup, (player, child) => {
			const portal = child.setActive(true).setName('Portal');
			this._playerInteractWith = portal;
		});
	}

	private createLeftBoundary (): void {
		const leftBounds = new Tile(this, 16, 485, '');
		leftBounds.setOrigin(1).setDisplaySize(16, 256).refreshBody();
		this.physics.add.collider(this._player, leftBounds);
	}

	private createInputHandler (): void {
		this.input
		.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			if (pointer.x > RIGHT_AREA) {
				this._onInteraction = true;
			}
			if (pointer.x <= RIGHT_AREA) {
				this._onMove = true;
			}
		})
		.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			if (pointer.x <= RIGHT_AREA) {
				this._onMove = false;
			}
			else if (this.input.pointer1.noButtonDown()) {
				this._onMove = false;
			}
		});
	}

	private createHint (): Array<Phaser.GameObjects.BitmapText> {
		const hints = new Array<Phaser.GameObjects.BitmapText>();
		const hintData = [
			{
				x: 176, y: 363,
				hintMessage: "Berjalanlah dengan\nmenekan area arah"
			},
			{
				x: 420, y: 230,
				hintMessage: "Melompatlah dengan\nmenekan area gesture"
			},
			{
				x: 810, y: 260,
				hintMessage: "Kumpulkanlah koin\nsebanyak banyaknya"
			},
			{
				x: 1035, y: 355,
				hintMessage: "Tekan area gesture untuk\nberinteraksi dengan\norang-orang"
			},
			{
				x: 1450, y: 150,
				hintMessage: "Tekan area gesture untuk\nmengambil barang yang\nkamu temui"
			},
		];
		for (const data of hintData) {
			const hintObject = this.add.bitmapText(data.x, data.y, 'comfortaa_w', data.hintMessage);
			hints.push(hintObject);
			hintObject.setCenterAlign().setOrigin(0.5).setFontSize(20).setDepth(1);
			hintObject.setVisible(false).setActive(false);
		}
		return hints;
	}

	private onDevelopmentMethod (): void {
		if (IsInDevelopment()) {
			const touchLine = this.add.graphics();
			touchLine.lineStyle(2, 0x000, 0.9);
			touchLine.moveTo(LEFT_AREA, 0).lineTo(LEFT_AREA, SCREEN_HEIGHT);
			touchLine.moveTo(RIGHT_AREA, 0).lineTo(RIGHT_AREA, SCREEN_HEIGHT);
			touchLine.strokePath().setScrollFactor(0).setDepth(1);
		}
	}

	update (time: number, delta: number): void {
		const onCutsceneState = this._gameState === GameState.Cutscene;
		if (!onCutsceneState) {
			// this.keyboardController(delta);
			this.touchController();
		}
		this._player.movementSystem();

		this.playerFallCondition();

		OnExitOverlap((this._playerInteractWith?.body as Phaser.Physics.Arcade.Body), () => {
			this._playerInteractWith.setActive(false);
		});
	}

	private touchController (): void {
		const pointer = this.input.activePointer;

		if (this._onMove) {
			const onLeftArea = pointer.x <= LEFT_AREA;
			const onRightArea = !onLeftArea && pointer.x <= RIGHT_AREA;
			const onDialogueState = this._gameState === GameState.Dialogue;

			if (onLeftArea && !onDialogueState) {
				this._player.doLeft();
			}
			else if (onRightArea && !onDialogueState) {
				this._player.doRight();
			}
		}
		else {
			this._player.doIdle();
		}

		if (this._onInteraction) {
			const canInteraction = this._playerInteractWith?.active;
			if (canInteraction) {
				console.log('Interact with object:', this._playerInteractWith.name);
				if (this._playerInteractWith instanceof ObjectiveItem) {
					console.log(this._playerInteractWith.collect());
					this.completeObjectiveBound('get_pouch_item');
				}
				else if (this._playerInteractWith.name === 'NPC') {
					this.eventUI.emit('event#register_dialogue');
					this.eventUI.emit('event#npc_dialogue', 'talk_to_npc');
				}
				else if (this._playerInteractWith.name === 'Portal') {
					this.eventUI.emit('event#register_dialogue');
					this.eventUI.emit('event#npc_dialogue', 'next_stage');
				}
			}
			else {
				this._player.doJump();
			}
			this._onInteraction = false;
		}
	}

	playerFallCondition (): void {
		const playerPosY = this._player.y - this._player.displayHeight;
		const isPlayerFall = playerPosY > this._deadAreaY;
		if (isPlayerFall) {
			this.eventUI.emit('UI#do_gameover');
		}
	}

}
