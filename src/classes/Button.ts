import * as Phaser from "phaser"

interface Props{
	width?: number;
	height?: number;
	onClick?: Function;
}

export class Button extends Phaser.GameObjects.Container {
	seKey: string = "";
	text: Phaser.GameObjects.Text;
	container: Phaser.GameObjects.Rectangle;

	constructor (scene: Phaser.Scene, x: number | undefined, y: number | undefined, text: string | string[], props: Props, { align = 'center', fontSize = 15, color = "black" } = {}) {
		super(scene, x, y)

		const {
			width = 100,
			height = 100,
			onClick
		} = props

		this.scene = scene;
		this.scene.add.existing(this);

		this.setSize(width, height).setInteractive();

		const alignLeft = align === 'left';
		this.text = scene.add.text(alignLeft ? -width / 2 + 0 : 0, -1, text, { align, fontSize , color}).setOrigin(alignLeft ? 0 : 0.5, 0.5).setPadding(0, 2, 0, 0)
		this.text.setColor("black");

        //this.container = scene.add.image(0,0,);

		this.container = scene.add.rectangle(0, 0, width / 2, height / 2);
		this.container.setStrokeStyle(1, 0xffffff).setOrigin(alignLeft ? 0 : 0.5, 0.5)

		this.add([this.container, this.text])
		this.on('pointerover', () => {
			this.text.setColor("white");
		})
		this.on('pointerout', () => {
			console.log("aaa");
			this.text.setColor("black");
		})
		this.on('pointerup', (p: any) => {
			onClick && onClick(p);
		})
	}

	setSeKey(key: string){
		this.seKey = key
		return this
	}
	setText (text: string | string[]) {
		this.text.setText(text)
		return this
	}
}
