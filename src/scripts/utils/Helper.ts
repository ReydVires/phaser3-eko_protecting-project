import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../config";

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

	static drawDebugLine (graphics: Phaser.GameObjects.Graphics, dimension: number = 32): void {
		Helper.log("Draw debug lines in " + dimension + "px");
		const height = Math.ceil(SCREEN_HEIGHT / dimension);
		const width = Math.ceil(SCREEN_WIDTH / dimension);

		graphics.lineStyle(1, 0xecf0f1, 0.85);
		for (let row = 0; row < height; row++) {
			graphics.moveTo(0, row * dimension);
			graphics.lineTo(SCREEN_WIDTH, row * dimension);
			for (let col = 0; col < width; col++) {
				graphics.moveTo(col * dimension, 0);
				graphics.lineTo(col * dimension, SCREEN_HEIGHT);
			}
		}
		graphics.strokePath();
	}

	static nextSceneFadeOut(currentScene: Phaser.Scene, sceneName: string): void {
		Helper.log("Go to scene: " + sceneName);
		const cam = currentScene.cameras.main;
		cam.once('camerafadeoutcomplete', () => {
			currentScene.scene.start(sceneName);
		});
		cam.fadeOut(300);
	}

	static log (message: string, arg?: any): void {
		if (arg) {
			console.log("[HELPER] " + message, arg);
		}
		else {
			console.log("[HELPER] " + message);
		}
	}

}
