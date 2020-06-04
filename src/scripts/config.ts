//#region Import scene modules
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuViews } from './scenes/MenuViews';
import { GameScene } from './scenes/GameScene';
import { GameUIScene } from './scenes/GameUIScene';
import { MinigameViews } from './scenes/MinigameViews';
import { TutorialGameScene } from './scenes/MiniGames/TutoarialGameScene';
import { TutorialGameUIScene } from './scenes/MiniGames/TutorialGameUIScene';
import { LeaderboardViews } from './scenes/LeaderboardViews';
import { StoreViews } from './scenes/StoreViews';
import { WorldmapViews } from './scenes/WorldmapViews';
import { LumCutsceneViews } from './scenes/MiniGames/LumCutsceneViews';
import { IntroScene } from './scenes/IntroScene';
import { IntroUIScene } from './scenes/IntroUIScene';

//#endregion
export const SCREEN_WIDTH: number = 1280;
export const SCREEN_HEIGHT: number = 720;
export const LEFT_AREA: number = 210;
export const RIGHT_AREA: number = 570;
export const centerX: number = SCREEN_WIDTH / 2;
export const centerY: number = SCREEN_HEIGHT / 2;

const scenes: Array<Function> = [
	BootScene,
	PreloadScene,
	MenuViews,
	MinigameViews,
	LeaderboardViews,
	StoreViews,
	WorldmapViews,
	IntroScene,
	IntroUIScene,
	LumCutsceneViews,
	TutorialGameScene,
	TutorialGameUIScene,
	GameScene,
	GameUIScene,
];

export const Config: Phaser.Types.Core.GameConfig = {
	title: 'Phaser 3 Game',
	type: Phaser.AUTO,
	backgroundColor: '#ffffff', //#0984e3
	scale: {
		parent: 'phaser-game',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},
	seed: [ Date.now().toString() ],
	input: { activePointers: 3 },
	dom: { createContainer: true },
	scene: scenes,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 550 }
		}
	},
	render: {
		pixelArt: false,
		antialias: true,
		roundPixels: false,
	},
	// fps: {
	// 	target: 60,
	// 	forceSetTimeOut: false // true
	// }
};
