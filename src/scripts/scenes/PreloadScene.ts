import { SCREEN_WIDTH, centerX, centerY } from "../config";
import { RetrieveOnceJSON } from "../utils/Helper";

export class PreloadScene extends Phaser.Scene {

	private _barWidth: number;
	private _barHeight: number;
	private _xStart: number;
	private _yStart: number;
	private _progressBar: Phaser.GameObjects.Graphics;

	constructor () {
		super('PreloadScene');
	}

	init (): void {
		console.log(`PreloadScene`);
	}

	preload (): void {
		this.createLoadingBar(centerX, centerY, 16, 32);
		this.load.pack('image', 'assets/assetpack.json', 'imagePack');
		this.load.pack('spritesheet', 'assets/assetpack.json', 'spritesheetPack');
		this.load.pack('bitmapFont', 'assets/assetpack.json', 'bitmapFontPack');

		this.load.json('player_anim', 'assets/animations/player_anim.json');
		this.load.json('gameObject_anim', 'assets/animations/gameObject_anim.json');
		this.load.json('nat_anim', 'assets/animations/nat_anim.json');

		this.load.json('menu_tips', 'assets/dialogues/menutips.json');
		this.load.json('tutorial_data_level', 'assets/levels/tutorialLevel.json');
		this.load.json('dialogue_cutscene_intro', 'assets/dialogues/cutscene01.json');
		this.load.json('dialogue_cutscene_cave', 'assets/dialogues/cutscene02.json');
		this.load.json('dialogue_cutscene_lum_encounter', 'assets/dialogues/cutscene03.json');
	}

	create (): void {
		const cache = this.cache.json;
		const animateJSON = [
			RetrieveOnceJSON(cache, 'player_anim'),
			RetrieveOnceJSON(cache, 'nat_anim'),
			RetrieveOnceJSON(cache, 'gameObject_anim'),
		];
		this.registerAnimate(animateJSON);
		/**
		 * This is how you would dynamically import the mainScene class (with code splitting),
		 * add the mainScene to the Scene Manager
		 * and start the scene.
		 * The name of the chunk would be 'mainScene.chunk.js
		 * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
		 */
		// let someCondition = true;
		// if (someCondition)
		// 	import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
		// 		this.scene.add('MainScene', mainScene.default, true);
		// 	});
		// else
		// 	console.log('The mainScene class will not even be loaded by the browser');
	}

	registerAnimate (animateJSON: unknown): void {
		if (Array.isArray(animateJSON)) {
			for (const anims of animateJSON) {
				for (const anim of anims) {
					const config = anim as Phaser.Types.Animations.Animation;
					this.anims.create(config);
				}
			}
		}
	}

	updateProgressbar (percentage: number): void {
		this._progressBar.clear();
		this._progressBar.fillStyle(0x00cec9, 1);
		this._progressBar.fillRect(
			this._xStart,
			this._yStart,
			percentage * this._barWidth,
			this._barHeight
		);
	}

	emitEventLoading (): void {
		this._progressBar = this.add.graphics();

		this.load.on('progress', this.updateProgressbar.bind(this));
		this.load.once('complete', () => {
			this.load.off('progress', this.updateProgressbar.bind(this));
			this.scene.start('MenuViews');
			this._progressBar.destroy();
		});
	}

	createLoadingText (x: number, y: number, height: number, text: string): void {
		const offsetY = 12;
		const loadingText = {
			x: x,
			y: y - (height + offsetY),
			text: text,
			style: {
				fill: 'black',
				fontSize: '32px',
				fontStyle: 'bold'
			}
		};
		this.make
			.text(loadingText)
			.setOrigin(0.5);
	}

	createLoadingBar (x: number, y: number, height: number, barPadding: number = 16): void {
		this.createLoadingText(x, y, height, 'LOADING');

		// Size and position
		this._barWidth = SCREEN_WIDTH - barPadding;
		this._barHeight = height;
		this._xStart = x - this._barWidth / 2;
		this._yStart = y - this._barHeight / 2;

		const borderOffset = 2;
		const borderRect = new Phaser.Geom.Rectangle(
			this._xStart - borderOffset,
			this._yStart - borderOffset,
			this._barWidth + borderOffset * 2,
			this._barHeight + borderOffset * 2
		);

		const borderLine = this.add.graphics({
			lineStyle: {
				width: 2,
				color: 0x636e72
			}
		});
		borderLine.strokeRectShape(borderRect);

		// Create background bar
		const bgBar = this.add.graphics();
		bgBar.fillStyle(0xdfe6e9, 0.95);
		bgBar.fillRect(
			this._xStart - 1,
			this._yStart - 1,
			this._barWidth + borderOffset,
			this._barHeight + borderOffset
		);

		this.emitEventLoading();
	}
}
