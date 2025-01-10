import * as Phaser from "phaser";
import { smoothsteptanh } from "./ExtraMath";

export class Card extends Phaser.GameObjects.Container {
  num: number = 0;
  side: string = "nothing";
  defaultsize: number = 1.0;
  expandedsize: number = 2.2;
  size: number = 1.0;
  moveable: boolean = true;
  scene: Phaser.Scene;
  defaultheight: number = 88;
  defaultwidth: number = 63;
  img: Phaser.GameObjects.Image;

  beforex: number = 0;
  beforey: number = 0;
  targetx: number = 0;
  targety: number = 0;
  moveframetime: number = 1;
  movingframe: number = 0;

  hoverflag: boolean = false;
  insidescreenflag: boolean = false;
  targetsize: number = 1.0;
  sizeframetime: number = 1;
  scalingframe: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
    super(scene, x, y);

    this.num = num;
    this.side = side;
    this.size = size;
    this.defaultsize = size;
    this.expandedsize = size*this.expandedsize;

    this.x = x;
    this.x = y;

    this.scene = scene;
    this.scene.add.existing(this);

    this.img = this.scene.add.image(this.x, this.y, side + String(num));
    this.img.setDisplaySize(this.defaultwidth * this.size, this.defaultheight * this.size);
    this.setSize(this.defaultwidth * this.size, this.defaultheight * this.size).setInteractive();
  }

  insidescreen_on(){
    this.insidescreenflag = true;
  }
  
  insidescreen_off(){
    this.insidescreenflag = false;
  }

  hover_on() {
    this.on('pointerover', () => {
      this.img.depth += 1;
      this.hoverflag = true;
    })
    this.on('pointerout', () => {
      this.img.depth -= 1;
      this.hoverflag = false;
    })
  }

  hover_off(){
    this.hoverflag = false;
    this.off('pointerover');
    this.off('pointerout');
  }

  setOnClick(onClick: Function){
    this.off('pointerup');
		this.on('pointerup', (p: any) => {
			onClick && onClick(p);
		})
  }

  moveSmoothly(x: number, y: number, f: number, defaultsize: number = this.defaultsize) {
    this.beforex = this.x;
    this.beforey = this.y;
    this.targetx = x;
    this.targety = y;

    this.defaultsize = defaultsize;

    this.moveframetime = f;
    this.movingframe = f;
  }

  hover_scale() {
    if(this.hoverflag){
      this.size += 0.2;
      if (this.size >= this.expandedsize) {
        this.size = this.expandedsize;
      }
    }
    else{
      this.size -= 0.2;
      if (this.size <= this.defaultsize) {
        this.size = this.defaultsize;
      }
    }
  }

  update() {
    if (this.moveable == false) {
      return;
    }
    else {
      this.hover_scale();
      this.img.setDisplaySize(this.defaultwidth * this.size, this.defaultheight * this.size);
      if (this.movingframe > 0) {
        this.movingframe -= 1;
        this.x = this.targetx + (this.beforex - this.targetx) * smoothsteptanh(this.movingframe / this.moveframetime);
        this.y = this.targety + (this.beforey - this.targety) * smoothsteptanh(this.movingframe / this.moveframetime);
        this.size = this.defaultsize +  (this.size - this.defaultsize) * smoothsteptanh(this.movingframe / this.moveframetime);
        if(this.insidescreenflag){
          let marginx = 0;
          let marginy = 0;
          if((this.x + this.img.width/2) > this.scene.game.canvas.width){
            marginx = (this.x + this.img.width/2) - this.scene.game.canvas.width;
          }
          else if((this.x - this.img.width/2) < 0){
            marginx = -(this.x - this.img.width/2);
          }
          if((this.y + this.img.height/2) > this.scene.game.canvas.height){
            marginy = (this.y + this.img.height/2) - this.scene.game.canvas.height;
          }
          else if((this.y - this.img.height/2) < 0){
            marginy = -(this.y - this.img.height/2);
          }
          this.img.setX(this.x + marginx);
          this.img.setY(this.y + marginy);
        }
        else{
          this.img.setX(this.x);
          this.img.setY(this.y);
        }
      }
    }
  }
}