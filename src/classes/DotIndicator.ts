import * as Phaser from "phaser"

export class DotIndicator extends Phaser.GameObjects.Container {
	centerx: number = -30000;
	centery: number = -30000;
	margin: number = 0;
	totaldot: number = 0;
	currentdot: number = 0;

	isHorizontal: boolean = false;
	defaultheight: number = 8;
	defaultwidth: number = 8;
	dotsize: number = 1.0;

	pickimg: Phaser.GameObjects.Image;
	dotimg: Phaser.GameObjects.Image[] = [];

	constructor (scene: Phaser.Scene, centerx: number, centery: number, margin: number, totaldot: number, currentdot: number, isHorizontal: boolean = true, dotsize: number = 1.0) {
		super(scene, centerx, centery);

		this.centerx = centerx;
		this.centery = centery;
		this.margin = margin;
		this.isHorizontal = isHorizontal;
		this.totaldot = totaldot;
		this.currentdot = currentdot;

		this.scene = scene;
		this.scene.add.existing(this);

		this.pickimg = scene.add.image(
			centerx + Number(isHorizontal )*(currentdot-totaldot/2.0)*margin + ((totaldot+1)%2)*margin/2,
			centery + Number(!isHorizontal)*(currentdot-totaldot/2.0)*margin + ((totaldot+1)%2)*margin/2,
			"dot_pick"
		).setOrigin(0.5, 0.5);

		this.pickimg.setSize(this.defaultwidth*dotsize, this.defaultheight*dotsize);
		this.pickimg.depth = 102;

		for(let i = 0; i < this.totaldot; i++){
			this.dotimg.push(
				scene.add.image(
					this.centerx + Number(isHorizontal )*(i-totaldot/2.0)*margin + ((totaldot+1)%2)*margin/2,
					this.centery + Number(!isHorizontal)*(i-totaldot/2.0)*margin + ((totaldot+1)%2)*margin/2,
					"dot_default"
				).setOrigin(0.5, 0.5)
			);
			this.dotimg[i].depth = 101;
		}
	}

	setCurrentdot(num: number){
		this.currentdot = num;
		this.pickimg.setX(this.centerx + Number(this.isHorizontal )*(this.currentdot-this.totaldot/2.0)*this.margin + ((this.totaldot+1)%2)*this.margin/2);
		this.pickimg.setY(this.centery + Number(!this.isHorizontal)*(this.currentdot-this.totaldot/2.0)*this.margin + ((this.totaldot+1)%2)*this.margin/2);
	}
}
