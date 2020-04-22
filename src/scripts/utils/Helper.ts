import { SCREEN_HEIGHT, SCREEN_WIDTH, Config } from "../config";

type LineOption = {
	dimension?: number,
	height?: number,
	width?: number
};

export function ExitApp (): void {
	DebugLog("Do exit app");
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

export function FullscreenMode (): void {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	}
	else {
		if (document.exitFullscreen) {
			document.exitFullscreen(); 
		}
	}
}

export function IsInDevelopment (): boolean | undefined {
	return Config.physics?.arcade?.debug;
}

export function DebugLog (message?: any, ...optionalParams: any[]): void {
	if (optionalParams.length !== 0) {
		console.log("[Helper] " + message, optionalParams);
	}
	else {
		console.log("[Helper] " + message);
	}
}

export function PrintPointerPos (scene: Phaser.Scene, relativeOnWorld?: boolean): void {
	const posLabel = scene.add.text(0, 0, '(x, y)')
		.setDepth(100)
		.setOrigin(0.5, 1);
	scene.input
	.on('pointermove', (event: Phaser.Input.Pointer) => {
		if (IsInDevelopment()) {
			let localX, localY;
			if (!relativeOnWorld) {
				localX = Math.round(event.x);
				localY = Math.round(event.y);
			}
			else {
				localX = Math.round(event.worldX);
				localY = Math.round(event.worldY);
			}
			posLabel.setPosition(localX, localY)
				.setText(`(${localX}, ${localY})`);
		}
	});
}

export function NextSceneFadeOut (currentScene: Phaser.Scene, sceneName: string, data?: any): void {
	DebugLog("Go to scene: " + sceneName);
	// TODO: Input must be disable while being transition [scene.input.enabled = false]
	const cam = currentScene.cameras.main;
	cam.once('camerafadeoutcomplete', () => {
		// Passing zero `{}` object to clear based-scene variable
		currentScene.scene.start(sceneName, data ? data : {});
	});
	cam.fadeOut(300);
}

export function FadeIn (currentScene: Phaser.Scene, callback: Function, duration: number = 300): void {
	const cam = currentScene.cameras.main;
	cam.once('camerafadeincomplete', () => callback());
	cam.fadeIn(duration);
}

export function CheckPlatform (platformName: string | string[]): boolean {
	let isCompatible = false;
	let platformMap = new Map<string, boolean>();
	if (Array.isArray(platformName)) {
		for (const name of platformName) {
			const isPlatformExist = navigator.userAgent.indexOf(name) !== -1;
			platformMap.set(name, isPlatformExist);
		}
		platformMap.forEach((value, key) => {
			DebugLog(`Result platform ${key}:${value}`);
			if (value) {
				isCompatible = true;
			}
		});
	}
	else {
		isCompatible = navigator.userAgent.indexOf(platformName) !== -1;
	}
	return isCompatible;
}

export function DebugDrawLine (graphics: Phaser.GameObjects.Graphics, option?: LineOption, scene?: Phaser.Scene): void {
	// Set default value
	const dimension = option?.dimension || 32;
	const WIN_HEIGHT = option?.height || SCREEN_HEIGHT;
	const WIN_WIDTH = option?.width || SCREEN_WIDTH;

	const height = Math.ceil(WIN_HEIGHT / dimension);
	const width = Math.ceil(WIN_WIDTH / dimension);
	graphics.lineStyle(1, 0xecf0f1, 0.85);
	for (let row = 0; row < height; row++) {
		graphics.moveTo(0, row * dimension);
		graphics.lineTo(WIN_WIDTH, row * dimension);
		for (let col = 0; col < width; col++) {
			graphics.moveTo(col * dimension, 0);
			graphics.lineTo(col * dimension, WIN_HEIGHT);
			if (scene) { // Experiment
				const t = scene.add
					.text(col * dimension, row * dimension, `(${col},${row})`,
					<Phaser.Types.GameObjects.Text.TextStyle> {
						fontSize: '8px'
					});
			}
		}
	}
	graphics.strokePath();
}

export function RetrieveOnceJSON (cache: Phaser.Cache.BaseCache, key: string): any {
	let data = null;
	if (cache.has(key)) {
		data = cache.get(key);
		cache.remove(key);
	}
	console.assert(data !== null, "Retrieving a null value of JSON data");
	return data;
}