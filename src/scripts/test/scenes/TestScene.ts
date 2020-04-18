//#region Import modules
import { centerX, SCREEN_HEIGHT } from '../../config';
import { Player } from '../../objects/Player';
import { Tile } from '../../objects/Tile';
import { Helper } from '../../utils/Helper';
import * as LevelData from '../../levels/tutorialLevel.json';
import { KeyboardMapping } from '../../../../typings/KeyboardMapping';
import { Coin } from '../../objects/collectable/Coin';
import { BaloonSpeech } from '../../objects/BaloonSpeech';
import { BaseScene } from '../../objects/abstract/BaseScene';
import { ITouchControl } from '../../objects/interface/ITouchControl';

//#endregion

//#region Intarfaces
interface TileData {
	x: number;
	y: number;
	w: number;
	h: number;
}

interface CoinData {
	type: string;
	x: number;
	y: number;
	originX: number;
	originY: number;
	texture: string;
}

interface PortalData {
	id: string;
	info: TileData;
	goto: string;
}

interface SceneData {
	isTryAgain: boolean;
	isGameStarted: boolean;
}

interface DialogueData {
	text: string;
	bubblePosition: Phaser.GameObjects.Components.Transform;
	facing: number;
}
//#endregion

enum InGameState {
	Playable,
	Cutscene
}

export class TestScene extends BaseScene implements ITouchControl {

	private readonly LEFT_AREA: number = 210;
	private readonly RIGHT_AREA: number = 570;

	private _background: Phaser.GameObjects.Image;

	private _player: Player;
	private _playerInteractWith: Phaser.GameObjects.GameObject;

	private _keys: KeyboardMapping;
	private _deadZonePosY: number;
	private _pointer: Phaser.Input.InputPlugin;
	private _onTouch: boolean;
	private _actionArea: boolean;
	private _interactionArea: boolean;
	private _portalGroup: Phaser.Physics.Arcade.Group;
	private _platformCompatible: boolean;
	private _sceneState: InGameState;
	private _itemsOnMaps: Phaser.Physics.Arcade.Group;

	private _onCutsceneEvent: boolean;
	private _dialogues: Array<DialogueData>;

	private _bubbleChat: BaloonSpeech;
	private _hintTexts: Array<Phaser.GameObjects.Text>;

	constructor () {
		super('TestScene');
	}

	init (): void {
		super.init();
		console.log(`TestScene: For experimental only!`);
		this._platformCompatible = Helper.checkPlatform(['Android', 'iPhone']);
		this._onTouch = false;
		this._actionArea = false;
		this._interactionArea = false;
		this._onCutsceneEvent = false;
		this._sceneState = InGameState.Playable;
		this._hintTexts = new Array<Phaser.GameObjects.Text>();
		this._itemsOnMaps = this.physics.add.group();
	}

	create (sceneData: SceneData): void {
		// Helper.drawDebugLine(this.add.graphics(), {
		// 	dimension: 64,
		// 	width: 2000
		// }, this);
		Helper.printPointerPos(this, true);

		this._background = this.add.image(0, 0, 'tutorial_stage_bg').setOrigin(0);
		this.add.image(0, 0, 'tutorial_stage_platform_p1').setOrigin(0).setScrollFactor(0.9);
		this.add.image(0, 0, 'tutorial_stage_platform').setOrigin(0);
		this.add.image(0, 0, 'tutorial_stage_foreground').setOrigin(0).setScrollFactor(0.95);
		this.add.image(1725, 625, 'cave_entrance').setOrigin(0, 1);

		const cam = this.cameras.main;
		// Set bound camera, based on background level
		cam.setBounds(0, 0, this._background.displayWidth - 32, 0);

		this._player = new Player(this, 64, 575, 'eko_idle');
		cam.startFollow(this._player);

		this._deadZonePosY = cam.y + cam.height;

		const targetBubblePos = this._player as Phaser.GameObjects.Components.Transform;
		this._dialogues = new Array<DialogueData>(
			<DialogueData> {
				text: "Ini dialog test ke 1",
				bubblePosition: targetBubblePos,
				facing: 2
			},
			<DialogueData> {
				text: "Sekarang ada dialog test ke 2",
				bubblePosition: targetBubblePos,
				facing: 2
			},
			<DialogueData> {
				text: "I'm gonna head out!",
				bubblePosition: targetBubblePos,
				facing: 2
			}
		);

		// Tile generator
		// const tileGroup = this.generateTileLevel(LevelData.tileData);
		// this.physics.add.collider(this._player, tileGroup);

		// const coinGroup = this.generateCoin(LevelData.collectable);
		// this.physics.add.overlap(this._player, coinGroup, (player, coin) => {
		// 	coin.destroy();
		// });

		// this._portalGroup = this.generatePortal(LevelData.portalData);
		// this.physics.add.overlap(this._player, this._portalGroup, () => {
		// 	this._interactionArea = true;
		// });

		this.generateMapping(LevelData.mappingData);

		// Create hints!
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
				x: 805, y: 270,
				hintMessage: "Kumpulkanlah koin\nsebanyak banyaknya"
			},
			{
				x: 1090, y: 345,
				hintMessage: "Tekan area gesture untuk\nberinteraksi dengan\norang-orang"
			},
			{
				x: 1450, y: 150,
				hintMessage: "Tekan area gesture untuk\nmengambil barang yang\nkamu temui"
			},
		];
		for (const data of hintData) {
			const hintObject = this.add.text(data.x, data.y, data.hintMessage);
			hintObject.setAlign('center')
				.setOrigin(0.5)
				.setFontSize(20);
			this._hintTexts.push(hintObject);
		}

		// Define keyboard control
		// Alternate: this.input.keyboard.createCursorKeys();
		this._keys = this.input.keyboard.addKeys('RIGHT, LEFT, SPACE, ESC') as KeyboardMapping;

		this.input
		.on('pointerdown', (pointer: Phaser.Input.InputPlugin) => {
			this._onTouch = true;
			this._pointer = pointer;
			if (this.input.pointer1.isDown) {
				this._actionArea = true;
			}
		})
		.on('pointerup', (pointer: Phaser.Input.InputPlugin) => {
			// Check if no other touch input pressed
			if (this.input.pointer1.noButtonDown()) {
				this._onTouch = false;
			}
		})
		.on('pointermove', (pointer: Phaser.Input.InputPlugin) => {
			if (this._onTouch) {
				this._pointer = pointer;
			}
		});

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

		if (Helper.isInDevelopment()) {
			const touchLine = this.add.graphics();
			touchLine.lineStyle(2, 0x000, 0.9);
			touchLine.moveTo(this.LEFT_AREA, 0).lineTo(this.LEFT_AREA, SCREEN_HEIGHT);
			touchLine.moveTo(this.RIGHT_AREA, 0).lineTo(this.RIGHT_AREA, SCREEN_HEIGHT);
			touchLine.strokePath().setScrollFactor(0);
		}

		this.registerEvent('scenestate_playable', () => {
			this._sceneState = InGameState.Playable;
		});
	}

	generateMapping (mappingData: Array<string>): void {
		const maxLength = mappingData.length;
		const tileGroup = this.physics.add.staticGroup();
		const coinGroup = this.physics.add.group();
		const cutsceneZone = this.add.zone(0, 0, 0, 0);
		this._portalGroup = this.physics.add.group();
		for (let i = 0; i < maxLength; i++) {
			const row = mappingData[i].length;
			for (let j = 0; j < row; j++) {
				switch (mappingData[i][j]) {
					case 'o':
						const platform = new Tile(this, 64 * j, 64 * i, '')
							.setDisplaySize(64, 64)
							.refreshBody();
						tileGroup.add(platform);
						break;
					case 'c':
						const coin = new Coin(this, 64 * j, 64 * i, 'coin_game').setOrigin(0, 0.3);
						coin.play('anim_coin_game');
						coinGroup.add(coin);
						coin.getBody().setAllowGravity(false);
						break;
					case 'p':
						const zone = this.add.zone(j * 64, i * 64, 70, 64)
							.setOrigin(0);
						this.physics.world.enable(zone);
						this._portalGroup.add(zone);
						(zone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
						break;
					case 'e':
						cutsceneZone.setPosition(j * 64, i * 64)
							.setSize(64, 64)
							.setOrigin(0);
						this.physics.world.enable(cutsceneZone);
						(cutsceneZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
						break;
					case 'i':
						const gameItem = new Coin(this, j * 64, i * 64, 'item_random');
						this._itemsOnMaps.add(gameItem);
						gameItem.setName('OrdinaryItem');
						gameItem.setOrigin(0);
						gameItem.getBody().setAllowGravity(false);
						break;
					default:
						break;
				}
			}
		}

		this.physics.add.overlap(this._player, coinGroup, (player, coin) => {
			coin.destroy();
		});
		this.physics.add.overlap(this._player, cutsceneZone, (player, zone) => {
			console.log('Active Cutscene');
			this.callCutscene();
			zone.destroy();
		});
		this.physics.add.collider(this._player, tileGroup);
		this.physics.add.overlap(this._player, this._portalGroup, () => {
			this._interactionArea = true;
		});
		this.physics.add.overlap(this._player, this._itemsOnMaps, (player, item) => {
			this._playerInteractWith = item;
			this._interactionArea = true;
		});
	}

	generatePortal (portalData: Array<PortalData>): Phaser.Physics.Arcade.Group {
		const groups = this.physics.add.group();
		const maxPortal = portalData.length;
		for (let i = 0; i < maxPortal; i++) {
			const data = portalData[i].info;
			const zone = this.add.zone(data.x, data.y, data.w, data.h);
			zone.setOrigin(0);
			this.physics.world.enable(zone);
			groups.add(zone);
			(zone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
		}
		return groups;
	}

	generateCoin (coinData: Array<CoinData>): Phaser.Physics.Arcade.Group {
		const groups = this.physics.add.group({ classType: Coin });
		const maxCoin = coinData.length;
		for (let i = 0; i < maxCoin; i++) {
			const data = coinData[i];
			const coin = new Coin(this, data.x, data.y, data.texture)
				.setOrigin(data.originX, data.originY);
			groups.add(coin);
			coin.getBody().setAllowGravity(false);
		}
		return groups;
	}

	generateTileLevel (tileData: Array<TileData>): Phaser.Physics.Arcade.StaticGroup {
		const groups = this.physics.add.staticGroup({ classType: Tile });
		const maxTile = tileData.length;
		for (let i = 0; i < maxTile; i++) {
			const data = tileData[i];
			const tile = new Tile(this, data.x, data.y, '')
				.setDisplaySize(data.w, data.h)
				.refreshBody();
			groups.add(tile);
		}
		return groups;
	}

	callCutscene (): void {
		this._sceneState = InGameState.Cutscene;
		const cutscenes = new Array<Phaser.Tweens.Tween>(
			this.tweens.create({
				targets: this._player,
				x: `+=64`,
				duration: 300,
				onComplete: () => {
					this._player.animJump(0.4);
					cutscenes[1].play();
				}
			}),
			this.tweens.create({
				targets: this._player,
				x: `+=276`,
				duration: 750,
				onComplete: () => {
					this._player.animIdlle();
					this.time.delayedCall(700, () => {
						this._player.animWalk();
						this._player.setFlipX(true);
						cutscenes[2].play();
					});
				}
			}),
			this.tweens.create({
				targets: this._player,
				x: `-=64`,
				duration: 450,
				onComplete: () => {
					this._player.animIdlle();
					this.eventUI.emit('UI#show_dialogue');
					// this._sceneState = InGameState.Playable;
				}
			})
		);
		const timelineCutscene = this.tweens.createTimeline();
		this._player.animIdlle();
		timelineCutscene.add({
			targets: this._player,
			x: `+=96`,
			duration: 325,
			onComplete: () => {
				this._player.animJump();
			}
		})
		.add({
			targets: this._player,
			x: `+=182`,
			duration: 550,
			onComplete: () => {
				this._player.animIdlle();
				this.time.delayedCall(500, () => {
					this._player.animWalk();
					cutscenes[0].play();
				});
			}
		});

		this.time.delayedCall(500, () => {
			this._player.animWalk();
			timelineCutscene.play();
		});
	}

	keyboardController (): void {
		if (Phaser.Input.Keyboard.JustDown(this._keys.ESC)) {
			console.log('ESC key is pressed from keyboardController()');
		}
	}

	touchController (): void {
		if (this._onTouch) {
			const tapLeftArea = this._pointer.x <= this.LEFT_AREA;
			const tapRightArea = !tapLeftArea && this._pointer.x <= this.RIGHT_AREA;
			if (!this._onCutsceneEvent) {
				if (tapLeftArea) {
					this.touchLeftArea();
				}
				else if (tapRightArea) {
					this.touchRightArea();
				}
			}
			
			const tapJumpArea = !tapRightArea && this._pointer.x > this.RIGHT_AREA && this._actionArea;
			if (tapJumpArea) {
				this.touchAction();
			}
		}
		else {
			this._player.doIdle();
		}
		this._player.movementSystem();
	}

	touchRightArea(): void {
		this._player.doRight();
		const tolerance = 134;
		const boundaries = (this._background.displayWidth - this._player.displayWidth * 0.5) - tolerance;
		if (this._player.x >= boundaries) {
			this._player.setVelocityX(0);
		}
	}
	
	touchLeftArea(): void {
		this._player.doLeft();
		const boundaries = this._player.displayWidth * 0.5;
		if (this._player.x <= boundaries) {
			this._player.setVelocityX(0);
		}
	}
	
	touchAction(): void {
		const playerOnGround = this._player.body.blocked.down;
		if (!this._interactionArea) {
			this._player.doJump();
		}
		else if (this._playerInteractWith?.active) {
			console.log('Interact with:', this._playerInteractWith.name);
			this._interactionArea = false;
			this._playerInteractWith.destroy();
		}
		else if (playerOnGround) {
			this._bubbleChat?.destroy(); // Destroy the previous baloon rendered!
			if (this._dialogues.length > 0) {
				this._onCutsceneEvent = true;

				const dialogueData = this._dialogues.shift();
				const dialogueText = dialogueData!.text;
				const targetPosition = dialogueData!.bubblePosition;
				// console.log("Target GO", targetPosition);
				const facing = dialogueData!.facing;
				this._bubbleChat = new BaloonSpeech(
					this,
					targetPosition.x - 280, targetPosition.y - (160 + 160 * 1.25),
					280, 160,
					dialogueText, facing
				);
			}
			else {
				this.input.enabled = false;
				this._onCutsceneEvent = false;
				this.tweens.add({
					delay: 500,
					targets: this._player,
					alpha: 0,
					duration: 250,
					onComplete: () => {
						this.eventUI.emit('UI#to_scene_tutorial');
					}
				});
				console.log("Cutscene interaction end");
			}
		}
		this._actionArea = false;
	}

	update (): void {
		if (this._sceneState === InGameState.Playable) {
			if (this._platformCompatible) {
				this.touchController();
				this.keyboardController(); // FIXME: [Debug] Touch only
			}
			else {
				this.touchController(); // FIXME: [Debug] Keyboard only
				this.keyboardController();
			}
		}

		// Fall condition
		if (this._player.y - this._player.displayHeight > this._deadZonePosY) {
			console.log('Dead flag!');
			this.eventUI.emit('UI#do_gameover');
		}

		// Test on exit collider
		this._portalGroup.getChildren().forEach((object) => {
			const child = (object.body as Phaser.Physics.Arcade.Body);
			const colliderStatus = child.touching.none;
			if (this._interactionArea && colliderStatus) {
				this._interactionArea = false;
				this._bubbleChat?.destroy(); // After out the collision
			}
		});
	}

	/**
	 * @override
	 */
	pauseScene (): void {
		this._onTouch = false;
		super.pauseScene(!this.scene.isPaused());
	}

}
