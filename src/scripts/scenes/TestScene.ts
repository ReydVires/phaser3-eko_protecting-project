import { FPSText } from '../objects/FPSText';
import { SCREEN_HEIGHT } from '../config';
import { Player } from '../objects/Player';
import { Tile } from '../objects/Tile';
import { Helper } from '../utils/Helper';
import * as LevelData from '../levels/tutorialLevel.json';
import { KeyboardMapping } from '../../../typings/KeyboardMapping';

type TileData = {
	x: number,
	y: number,
	w: number,
	h: number
};

export class TestScene extends Phaser.Scene {

	private _fpsText: Phaser.GameObjects.Text;
	private _player: Player;
	private _keys: KeyboardMapping;

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
		this._player = new Player(this, 64, 520, 'player');
		cam.startFollow(this._player);

		// Tile generator
		const tileGroup = this.generateTileLevel(LevelData.tileData);
		this.physics.add.collider(this._player, tileGroup);

		// Define keyboard control
		this._keys = this.input.keyboard.addKeys('RIGHT, LEFT, SPACE') as KeyboardMapping;
	}

	generateTileLevel (tileData: Array<TileData>): Phaser.Physics.Arcade.StaticGroup {
		const levelGroup = this.physics.add.staticGroup();
		const maxTile = tileData.length;
		
		for (let i = 0; i < maxTile; i++) {
			const data = tileData[i];
			const tile = new Tile(this, data.x, data.y, '');
			levelGroup.add(tile);
			tile.setDisplaySize(data.w, data.h)
				.refreshBody();
		}
		return levelGroup;
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
	}

}
