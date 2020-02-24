import { FPSText } from '../objects/FPSText';
import { SCREEN_HEIGHT } from '../config';
import { Player } from '../objects/Player';
import { Tile } from '../objects/Tile';
import { Helper } from '../utils/Helper';
import * as LevelData from '../levels/tutorialLevel.json';
import { KeyboardMapping } from '../../../typings/KeyboardMapping';
import { Coin } from '../objects/collectable/Coin';

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

export class TestScene extends Phaser.Scene {

	private _fpsText: Phaser.GameObjects.Text;
	private _player: Player;
	private _keys: KeyboardMapping;
	private _deadZonePosY: number;

	constructor () {
		super('TestScene');
	}

	init (): void {
		console.log(`TestScene: For experimental only!`);
	}

	create (): void {
		this._fpsText = new FPSText(this);
		Helper.drawDebugLine(this.add.graphics(), 64);
		const bg = this.add
			.image(0, SCREEN_HEIGHT, 'level_tutorial1')
			.setOrigin(0, 1);
		const cam = this.cameras.main;
		cam.setBounds(0, 0, 2112, 276); // Set bound camera, based on background level
		this._player = new Player(this, 64, 520, 'players');
		cam.startFollow(this._player);
		
		this._deadZonePosY = cam.y + cam.height;

		// Tile generator
		const tileGroup = this.generateTileLevel(LevelData.tileData);
		const coinGroup = this.generateCoin(LevelData.collectable);
		this.physics.add.collider(this._player, tileGroup);
		this.physics.add.overlap(this._player, coinGroup, (p, c) => {
			c.destroy();
		});

		// Define keyboard control
		// Alternate: this.input.keyboard.createCursorKeys();
		this._keys = this.input.keyboard.addKeys('RIGHT, LEFT, SPACE') as KeyboardMapping;
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

	controller (): void {
		if (this._keys.RIGHT.isDown) {
			this._player.doRight();
		}
		else if (this._keys.LEFT.isDown) {
			this._player.doLeft();
		}
		else {
			this._player.doIdle();
		}

		if (Phaser.Input.Keyboard.JustDown(this._keys.SPACE)) {
			this._player.doJump();
		}
	}

	update (): void {
		this._fpsText.update();
		this.controller();
		if (this!._player.y - this._player.displayHeight > this._deadZonePosY) {
			this._player.setPosition(64, 480);
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
				repeat: 4,
			});
		}
	}

}
