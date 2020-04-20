export function OnExitOverlap (gameObject: Phaser.Physics.Arcade.Sprite, callback: Function): void {
	if (gameObject?.active) {
		const body = gameObject.body as Phaser.Physics.Arcade.Body;
		const isAnyOverlap = body.wasTouching.none;
		if (!isAnyOverlap && body.touching.none) {
			callback();
		}
	}
}

export function OnEnterOverlap (gameObject: Phaser.Physics.Arcade.Sprite, callback: Function): void {
	if (gameObject?.active) {
		const body = gameObject.body as Phaser.Physics.Arcade.Body;
		const isAnyOverlap = body.wasTouching.none;
		if (isAnyOverlap && !body.touching.none) {
			callback();
		}
	}
}