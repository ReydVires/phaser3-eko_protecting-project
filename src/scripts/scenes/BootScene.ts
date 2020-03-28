import { Helper } from "../utils/Helper";

declare const WebFont: any;
declare const AndroidFullScreen: any;

export class BootScene extends Phaser.Scene {

	constructor () {
		super('BootScene');
	}

	init (): void {
		console.log(`BootScene`);
		console.log("platform:", navigator.userAgent);
		if (Helper.checkPlatform('Android')) {
			AndroidFullScreen?.immersiveMode();
			const insomniaPlugin = (window as any)?.plugins.insomnia;
			insomniaPlugin.keepAwake();
		}
	}

	preload (): void {
		this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	}

	create (): void {
		this.loadWebFont([
			'Comfortaa'
		]);
		this.scene.start('PreloadScene');
	}

	loadWebFont(retrievedFont: Array<string>): void {
		// Retrieve font from google
		WebFont.load({
			google: { families: retrievedFont },
			timeout: 2000,
			active: () => {
				console.log("Load WebFont success!", retrievedFont);
			},
			fontinactive: () => {
				console.log("Load WebFont failed to render!", retrievedFont);
			},
			inactive: () => {
				console.log("Can't load WebFont!", retrievedFont);
			}
		});
	}

}