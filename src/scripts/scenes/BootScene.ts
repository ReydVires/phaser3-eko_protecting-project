import { centerX, centerY } from "../config";
import { AndroidBackHelper } from "../utils/AndroidBackHelper";
import { CheckPlatform, IsInDevelopment } from "../utils/Helper";

declare const WebFont: any;
declare const AndroidFullScreen: any;

export class BootScene extends Phaser.Scene {

	constructor () {
		super('BootScene');
	}

	init (): void {
		console.log(`BootScene`);
		if (CheckPlatform('Android')) {
			// Installed plugin for Android
			AndroidFullScreen?.immersiveMode();

			const insomniaPlugin = (window as any)?.plugins.insomnia;
			insomniaPlugin.keepAwake();
			
			AndroidBackHelper.Instance.setCallbackBackButton(() => {
				console.log('Prevent back button to exit!');
			});
		}
		this.cameras.main.setBackgroundColor(0xffffff);
	}

	preload (): void {
		this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
		this.load.pack('booting', 'assets/assetpack.json', 'bootingPack');
	}

	create (): void {
		this.loadWebFont(['Comfortaa']);
		if (IsInDevelopment()) {
			console.log("platform:", navigator.userAgent);
			this.scene.start('PreloadScene');
		}
		else {
			this.createSplashscreen();
		}
	}

	createSplashscreen (): void {
		const teluLogo = this.add.image(centerX, centerY, 'telu_logo').setAlpha(0);
		// const phaserLogo = this.add.image(centerX, centerY, 'phaser-logo').setAlpha(0);

		const timelineSplash = this.tweens.createTimeline();
		timelineSplash.add({
			targets: teluLogo,
			delay: 800,
			alpha: 1,
			duration: 800
		})
		.add({
			targets: teluLogo,
			delay: 800,
			alpha: 0,
			duration: 800,
			onComplete: () => {
				this.time.delayedCall(150, () => {
					this.scene.start('PreloadScene');
				});
			}
		});
		// .add({
		// 	targets: phaserLogo,
		// 	alpha: 1,
		// 	duration: 800,
		// })
		// .add({
		// 	targets: phaserLogo,
		// 	delay: 800,
		// 	alpha: 0,
		// 	duration: 800,
		// 	onComplete: () => {
		// 		this.time.delayedCall(150, () => {
		// 			this.scene.start('PreloadScene');
		// 		});
		// 	}
		// });
		timelineSplash.play();
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