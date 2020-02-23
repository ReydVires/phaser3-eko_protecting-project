import { FPSText } from '../objects/FPSText';
import { SCREEN_HEIGHT } from '../config';
import { Player } from '../objects/Player';
import { Tile } from '../objects/Tile';
import { Helper } from '../utils/Helper';
import * as LevelData from '../levels/tutorialLevel.json';

type LevelTileData = {
	x: number,
	y: number,
	w: number,
	h: number
};

export class TestScene extends Phaser.Scene {

	private _fpsText: Phaser.GameObjects.Text;
	private _player: Player;

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
		const tileGroup = this.generateTileLevel(LevelData);
		this.physics.add.collider(this._player, tileGroup);
	}

	generateTileLevel (levelData: Array<LevelTileData>): Phaser.Physics.Arcade.StaticGroup {
		const levelGroup = this.physics.add.staticGroup();
		const maxTile = (levelData as any).default.length; // Get length from JSON
		
		for (let i = 0; i < maxTile; i++) {
			const data = levelData[i];
			const tile = new Tile(this, data.x, data.y, '');
			levelGroup.add(tile);
			tile.setDisplaySize(data.w, data.h)
				.refreshBody();
		}
		return levelGroup;
	}

	update (): void {
		this._fpsText.update();
		const enter = this.input.keyboard.addKey('ENTER');
		if (Phaser.Input.Keyboard.JustDown(enter)) {
			this.tweens.add({
				targets: [this._player],
				x: '+=500',
				duration: 1000
			});
		}
	}

}
