import * as Phaser from "phaser"

interface Props{
	width?: number;
	height?: number;
	onClick?: Function;
}

export class Button extends Phaser.GameObjects.Container {
	seKey: string = "";
	text: string;
	default_image: Phaser.GameObjects.Image;
	hover_image: Phaser.GameObjects.Image;
	press_image: Phaser.GameObjects.Image;

	constructor (scene: Phaser.Scene, x: number | undefined, y: number | undefined, size: number, text: string | string[], props: Props, { align = 'center', fontSize = 15, color = "black" } = {}) {
		super(scene, x, y);

		this.text = String(text);

		var {
			width,
			height,
			onClick
		} = props

		this.scene = scene;
		this.scene.add.existing(this);

		this.default_image = scene.add.image(0, 0, this.text+"_default");
		this.hover_image = scene.add.image(0, 0, this.text+"_hover");
		this.press_image = scene.add.image(0, 0, this.text+"_press");
		width = this.default_image.width;
		height = this.default_image.height;

		this.default_image.setDisplaySize(width*size, height*size);
		this.hover_image.setDisplaySize(width*size, height*size);
		this.press_image.setDisplaySize(width*size, height*size);
		this.default_image.visible = true;
		this.hover_image.visible = false;
		this.press_image.visible = false;


		this.setSize(width*size, height*size).setInteractive();

		console.log({ align, fontSize , color});

		this.add([this.default_image, this.hover_image, this.press_image]);

		this.on('pointerover', () => {
			this.default_image.visible = false;
			this.hover_image.visible = true;
			this.press_image.visible = false;
		})
		this.on('pointerout', () => {
			this.default_image.visible = true;
			this.hover_image.visible = false;
			this.press_image.visible = false;
		})
		this.on('pointerdown', () => {
			this.default_image.visible = false;
			this.hover_image.visible = false;
			this.press_image.visible = true;
		})
		this.on('pointerup', (p: any) => {
			this.default_image.visible = true;
			this.hover_image.visible = false;
			this.press_image.visible = false;
			onClick && onClick(p);
		})
	}

}
