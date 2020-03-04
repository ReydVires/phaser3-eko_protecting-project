//#region Import modules
import { FPSText } from '../objects/FPSText';
import { SCREEN_HEIGHT, centerX } from '../config';
import { Player } from '../objects/Player';
import { Tile } from '../objects/Tile';
import { Helper } from '../utils/Helper';
import * as LevelData from '../levels/tutorialLevel.json';
import { KeyboardMapping } from '../../../typings/KeyboardMapping';
import { Coin } from '../objects/collectable/Coin';
import { BaloonSpeech } from '../objects/BaloonSpeech';
import { EventUIHandler } from '../utils/EventUIHandler';
import { IEventUIHandler } from '../objects/interface/IEventUIHandler';
import { ISceneControl } from '../objects/interface/ISceneControl';

//#endregion

// TODO: Make them interface
//#region Types
type TileData = {
	x: number,
	y: number,
	w: number,
	h: number
};

type CoinData = {
	type: string,
	x: number,
	y: number,
	originX: number,
	originY: number,
	texture: string
};

type PortalData = {
	id: string,
	info: TileData,
	goto: string
};

type SceneData = {
	isTryAgain: boolean,
	isGameStarted: boolean
};
//#endregion

export class TestScene extends Phaser.Scene implements IEventUIHandler, ISceneControl {

	private readonly LEFT_AREA: number = 275;
	private readonly RIGHT_AREA: number = 570;

	private _fpsText: Phaser.GameObjects.Text;
	private _player: Player;
	private _keys: KeyboardMapping;
	private _deadZonePosY: number;
	private _pointer: Phaser.Input.InputPlugin;
	private _onTouch: boolean;
	private _actionArea: boolean;
	private _interactionArea: boolean;
	private _portalGroup: Phaser.Physics.Arcade.Group;
	private _platformCompatible: boolean;

	private _bubbleChat: BaloonSpeech;

	private _eventUIHandler: EventUIHandler;

	constructor () {
		super('TestScene');
	}

	init (): void {
		console.log(`TestScene: For experimental only!`);
		this._platformCompatible = Helper.checkPlatform(['Android', 'iPhone']);
		this._onTouch = false;
		this._actionArea = false;
		this._interactionArea = false;
		this._eventUIHandler = new EventUIHandler(this.events);
	}

	create (sceneData: SceneData): void {
		this.input.addPointer(2);
		this.scene.launch('UITestScene');
		this._fpsText = new FPSText(this);
		Helper.drawDebugLine(this.add.graphics(), {
			dimension: 64,
			width: 2102
		});
		// Helper.printPointerPos(this, true);

		this.add.bitmapText(centerX, 0, 'simply round', "In Testing Mode 123")
			.setOrigin(0.5, 0)
			.setScrollFactor(0)
			.setFontSize(32);

		const bg = this.add
			.image(0, SCREEN_HEIGHT, 'level_tutorial1')
			.setOrigin(0, 1);
		const cam = this.cameras.main;
		cam.setBounds(0, 136, 2112, 276); // Set bound camera, based on background level
		this._player = new Player(this, 64, 520, 'players');
		cam.startFollow(this._player);

		this._deadZonePosY = cam.y + cam.height;

		// Tile generator
		const tileGroup = this.generateTileLevel(LevelData.tileData);
		const coinGroup = this.generateCoin(LevelData.collectable);
		this.physics.add.collider(this._player, tileGroup);
		this.physics.add.overlap(this._player, coinGroup, (player, coin) => {
			coin.destroy();
		});

		this._portalGroup = this.generatePortal(LevelData.portalData);
		this.physics.add.overlap(this._player, this._portalGroup, () => {
			this._interactionArea = true;
		});

		// Define keyboard control
		// Alternate: this.input.keyboard.createCursorKeys();
		this._keys = this.input.keyboard.addKeys('RIGHT, LEFT, SPACE, ESC') as KeyboardMapping;

		this.input.on('pointerdown', (pointer: Phaser.Input.InputPlugin) => {
			this._onTouch = true;
			this._pointer = pointer;
			if (this.input.pointer1.isDown) {
				this._actionArea = true;
			}
		});

		this.input.on('pointerup', (pointer: Phaser.Input.InputPlugin) => {
			// Check if no other touch input pressed
			// TODO: Set onTouch false when paused
			if (this.input.pointer1.noButtonDown()) {
				this._onTouch = false;
			}
		});

		this.input.on('pointermove', (pointer: Phaser.Input.InputPlugin) => {
			if (this._onTouch) {
				this._pointer = pointer;
			}
		});

		if (sceneData!.isTryAgain) {
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

		//#region Experiment Vector
		// const p1 = new Phaser.Math.Vector2();
		// this.input.on('pointerdown', (event: MouseEvent) => {
		// 	p1.x = event.x;
		// 	p1.y = event.y;
		// });
		// const p2 = new Phaser.Math.Vector2();
		// this.input.on('pointerup', (event: MouseEvent) => {
		// 	p2.x = event.x;
		// 	p2.y = event.y;
		// 	console.log("Data p2", p2);
		// 	console.log("Data p1", p1);
		// 	const p3 = p2.subtract(p1);
		// 	this._player.setPosition(this._player.x + p3.x, this._player.y + p3.y);
		// 	console.log("Dir", p3.normalize());
		// });
		//#endregion
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

	keyboardController (): void {
		if (Phaser.Input.Keyboard.JustDown(this._keys.ESC)) {
			console.log('ESC key is pressed from keyboardController()');
		}
	}

	touchController (): void {
		if (this._onTouch) {
			const tapLeftArea = this._pointer.x <= this.LEFT_AREA;
			const tapRightArea = !tapLeftArea && this._pointer.x <= this.RIGHT_AREA;
			const tapJumpArea = !tapRightArea && this._pointer.x > this.RIGHT_AREA && this._actionArea;
			if (tapLeftArea) {
				this._player.doLeft();
			}
			else if (tapRightArea) {
				this._player.doRight();
			}

			if (tapJumpArea) {
				if (!this._interactionArea) {
					this._player.doJump();
				}
				else {
					console.log("Show bubble talk! or other interaction.");
					if (this._bubbleChat) { // Destroy the previous baloon rendered!
						this._bubbleChat.destroy();
					}
					this._bubbleChat = new BaloonSpeech(
						this,
						this._player.x - 280, this._player.y - (160 + 160 * 0.75),
						280, 160,
						"I'm gonna head out!", 2
					);
				}
				this._actionArea = false;
			}
		}
		else {
			this._player.doIdle();
		}
		this._player.movementSystem();
	}

	update (): void {
		this._fpsText.update();
		
		if (this._platformCompatible) {
			this.touchController();
		}
		else {
			this.keyboardController();
		}

		// Fall condition
		if (this!._player.y - this._player.displayHeight > this._deadZonePosY) {
			console.log('Dead flag!');
			this._eventUIHandler.emit('UI:do_gameover');
		}

		// Test on exit collider
		this._portalGroup.getChildren().forEach((object) => {
			const child = (object.body as Phaser.Physics.Arcade.Body);
			const colliderStatus = child.touching.none;
			if (this._interactionArea && colliderStatus) {
				this._interactionArea = false;
				this._bubbleChat.destroy(); // After out the collision
			}
		});
	}

	eventUI (): EventUIHandler {
		return this._eventUIHandler;
	}

	startToScene (key: string, data?: object): void {
		this._eventUIHandler.removeAllEvents();
		this.scene.start(key, data);
	}

	restartScene (data?: object): void {
		this._eventUIHandler.removeAllEvents();
		this.scene.restart(data);
	}

	pauseScene (): void {
		this._onTouch = false;
		this.scene.pause();
	}

}
