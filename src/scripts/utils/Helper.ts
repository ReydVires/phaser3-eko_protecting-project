import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../config";

type LineOption = {
	dimension?: number,
	height?: number,
	width?: number
};

export class Helper {

	static exitApp (): void {
		Helper.log("Do exit app");
		const nav = navigator as any;
		if (nav.app) {
			nav.app.exitApp();
		}
		else if (nav.device) {
			nav.device.exitApp();
		}
		else {
			window.close();
		}
	}

	static printPointerPos (scene: Phaser.Scene, onWorld?: boolean): void {
		scene.input.on('pointerdown', (event: Phaser.Input.Pointer) => {
			let x, y: number;
			const type = onWorld ? "world" : "screen";
			if (!onWorld) {
				x = Math.round(event.x);
				y = Math.round(event.y);
			}
			else {
				x = Math.round(event.worldX);
				y = Math.round(event.worldY);
			}
			Helper.log(`Pointer ${type} pos: (${x}, ${y})`);
		});
	}

	static drawDebugLine (graphics: Phaser.GameObjects.Graphics, option?: LineOption): void {
		// Set default value
		const dimension = option!.dimension ? option!.dimension : 32;
		const WIN_HEIGHT = option!.height ? option!.height : SCREEN_HEIGHT;
		const WIN_WIDTH = option!.width ? option!.width : SCREEN_WIDTH;

		const height = Math.ceil(WIN_HEIGHT / dimension);
		const width = Math.ceil(WIN_WIDTH / dimension);
		graphics.lineStyle(1, 0xecf0f1, 0.85);
		for (let row = 0; row < height; row++) {
			graphics.moveTo(0, row * dimension);
			graphics.lineTo(WIN_WIDTH, row * dimension);
			for (let col = 0; col < width; col++) {
				graphics.moveTo(col * dimension, 0);
				graphics.lineTo(col * dimension, WIN_HEIGHT);
			}
		}
		graphics.strokePath();
	}

	static nextSceneFadeOut (currentScene: Phaser.Scene, sceneName: string): void {
		Helper.log("Go to scene: " + sceneName);
		const cam = currentScene.cameras.main;
		cam.once('camerafadeoutcomplete', () => {
			currentScene.scene.start(sceneName);
		});
		cam.fadeOut(300);
	}

	static createDimBackground (graphics: Phaser.GameObjects.Graphics, width?: number, height?: number): Phaser.GameObjects.Graphics {
		const rectangle = new Phaser.Geom.Rectangle(0, 0, width || SCREEN_WIDTH, height || SCREEN_HEIGHT);
		graphics
			.setScrollFactor(0)
			.fillStyle(0x000, 0.8)
			.fillRectShape(rectangle);
		graphics.setInteractive(rectangle, Phaser.Geom.Rectangle.Contains)
			.on('pointerup', () => Helper.log("All further inputs is blocked!"));
		return graphics;
	}

	static checkPlatform (platformName: string): boolean {
		return navigator.userAgent.indexOf(platformName) !== -1;
	}

	static log (message: string, arg?: any): void {
		if (arg) {
			console.log("[Helper] " + message, arg);
		}
		else {
			console.log("[Helper] " + message);
		}
	}

}
