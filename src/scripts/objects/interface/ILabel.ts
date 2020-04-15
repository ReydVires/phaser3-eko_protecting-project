export interface ILabel {

	getLabel (): Phaser.GameObjects.Text;
	setText (text: string, style?: Phaser.Types.GameObjects.Text.TextStyle): this;
	setPosition (x: number, y?: number, z?: number): this;
	setVisible (value: boolean): this;
	setAlpha (value: number): this;
	setScale (value: number): this;
	setDepth (value: number): this;
	setScrollFactor (value: number): this;
	destroy (): void;

}