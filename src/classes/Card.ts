import * as Phaser from "phaser";

export class Card extends Phaser.GameObjects.Container{
  num: number = 0;
  side: string = "nothing";
  size: number = 1.0;
  moveable: boolean = true;
  scene: Phaser.Scene;
  defaultheight: number = 88;
  defaultwidth: number = 63;
  img: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x:number, y:number, num: number, side: string, size: number) {
    super(scene, x, y);

    this.num = num;
    this.side = side;
    this.size = size;

    this.scene = scene;
    this.img = this.scene.add.image(this.x,this.y,side+String(num));
    this.img.setDisplaySize(this.defaultwidth*this.size, this.defaultheight*this.size);
  }

  update(){
    if(this.moveable == false){
      return;
    }
    else{
      this.img.setDisplaySize(this.defaultwidth*this.size, this.defaultheight*this.size);
    }
  }
}