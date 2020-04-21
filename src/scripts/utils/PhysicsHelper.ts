export function OnExitOverlap (body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody, callback: Function): void {
	const isAnyOverlap = body?.wasTouching.none;
	if (!isAnyOverlap && body?.touching.none) {
		callback();
	}
}

export function OnEnterOverlap (body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody, callback: Function): void {
	const isAnyOverlap = body?.wasTouching.none;
	if (isAnyOverlap && !body?.touching.none) {
		callback();
	}
}