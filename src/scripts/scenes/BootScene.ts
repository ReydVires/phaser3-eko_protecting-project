declare const WebFont: any;

export class BootScene extends Phaser.Scene {

	constructor () {
		super('BootScene');
	}

	init (): void {
		console.log(`BootScene`);
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
			active: () => {
				console.log("Load WebFont success!", retrievedFont);
			}
		});
	}

}