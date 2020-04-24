import { PhysicSprite } from "../abstract/PhysicSprite";
import { ICollectable } from "../interface/ICollectable";

type ItemInfo = {
	id: string,
	name: string
};

export class ObjectiveItem extends PhysicSprite implements ICollectable {

	private _id: string;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, id: string) {
		super(scene, x, y, texture);
		const tweenConfig = <Phaser.Types.Tweens.TweenBuilderConfig> {
			targets: this,
			y: '+=14',
			yoyo: true,
			repeat: -1,
			duration: Phaser.Math.Between(700, 1200)
		};
		scene.tweens.add(tweenConfig);
		this.setId(id);
	}

	private setId (id: string): void {
		if (id.length === 0) {
			this._id = "unknown";
		}
		else {
			this._id = id;
		}
	}

	public get id (): string {
		return this._id;
	}

	public collect(): ItemInfo {
		this.destroy();
		return <ItemInfo> {
			id: this.id,
			name: this.name
		};
	}

}