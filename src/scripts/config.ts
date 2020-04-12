//#region Import scene modules
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { TestScene } from './scenes/TestScene';
import { UITestScene } from './scenes/UITestScene';
import { UIGameScene } from './scenes/UIGameScene';
import { MiniGameScene } from './scenes/MiniGameScene';
import { TutorialGameScene } from './scenes/MiniGames/TutoarialGameScene';
import { UITutorialGameScene } from './scenes/MiniGames/UITutorialGameScene';
import { LeaderboardScene } from './scenes/LeaderboardScene';
import { StoreScene } from './scenes/StoreScene';

//#endregion
export const SCREEN_WIDTH: number = 1280;
export const SCREEN_HEIGHT: number = 720;
export const centerX: number = SCREEN_WIDTH / 2;
export const centerY: number = SCREEN_HEIGHT / 2;

const scenes: Array<Function> = [
	BootScene,
	PreloadScene,
	MenuScene,
	GameScene,
	UIGameScene,
	MiniGameScene,
	StoreScene,
	LeaderboardScene,
	TutorialGameScene,
	UITutorialGameScene,
	TestScene,
	UITestScene
];

export const Config: Phaser.Types.Core.GameConfig = {
	title: 'Phaser 3 Game',
	type: Phaser.AUTO,
	backgroundColor: '#0984e3',
	scale: {
		parent: 'phaser-game',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},
	input: { activePointers: 3 },
	dom: { createContainer: true },
	scene: scenes,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 600 }
		}
	},
	render: {
		pixelArt: false,
		antialias: true
	},
	// fps: {
	// 	target: 50,
	// 	forceSetTimeOut: true,
	// }
};
