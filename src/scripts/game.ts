import 'phaser';
import { Config } from './config';

export class Game extends Phaser.Game {

	constructor (gameConfig: Phaser.Types.Core.GameConfig) {
		super(gameConfig);
	}

}

window.addEventListener('load', () => {
	new Game(Config);
});
