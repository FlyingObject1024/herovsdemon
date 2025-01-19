import * as Phaser from "phaser"

export class CrystalIndicator extends Phaser.GameObjects.Container {
	centerx: number = -30000;
	centery: number = -30000;
	margin: number = 0;

	totalnum: number = 0;
	currentnum: number = 0;
	overnum: number = 0;

	isHorizontal: boolean = false;
	size: number = 1.0;

	crystalimg: Phaser.GameObjects.Image[] = [];

	constructor (scene: Phaser.Scene, centerx: number, centery: number, margin: number, totalnum: number, currentnum: number, isHorizontal: boolean = true, size: number = 1.0) {
		super(scene, centerx, centery);

		this.centerx = centerx;
		this.centery = centery;
		this.margin = margin;
		this.isHorizontal = isHorizontal;
		this.totalnum = totalnum;
		this.currentnum = currentnum;

		this.size = size;

		this.scene = scene;
		this.scene.add.existing(this);

		this.updateImages();
	}

	clearImages(){
		this.crystalimg.forEach((img) => {
			img.destroy();
		});
		this.crystalimg = [];
	}

	setCurrentNum(totalnum: number, currentnum: number, overnum: number){
		this.totalnum = totalnum;
		this.currentnum = currentnum;
		this.overnum = overnum;

		this.updateImages();
	}
	

	updateImages(){
		this.clearImages();
		let texture: string = "";
		for(let i = 0; i < this.totalnum; i++){
			if(i < (this.totalnum - this.currentnum)){
				if(i >= (this.totalnum - this.overnum)){
					texture = "icon_redcrystal";
				}
				else{
					texture = "icon_crystal";
				}
			}
			else{
				texture = "icon_hiddencrystal";
			}

			let img: Phaser.GameObjects.Image = 
				this.scene.add.image(
					this.centerx + Number(this.isHorizontal )*(i-this.totalnum/2.0)*this.margin,
					this.centery + Number(!this.isHorizontal)*(i-this.totalnum/2.0)*this.margin,
					texture
				).setOrigin(0.5, 0.5);

			img.setSize(img.width*this.size, img.height*this.size);
			this.crystalimg.push(img);
		}
	}
}
