import 'phaser';
import { Config } from './config';

window.addEventListener('load', () => {
	new Phaser.Game(Config);
});
