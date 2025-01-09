import * as Phaser from "phaser";

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

  hover_on() {
    this.on('pointerover', () => {
      this.hoverflag = true;
    })
    this.on('pointerout', () => {
      this.hoverflag = false;
    })
  }

  moveSmoothly(x: number, y: number, f: number) {
    this.beforex = this.x;
    this.beforey = this.y;
    this.targetx = x;
    this.targety = y;
    this.moveframetime = f;
    this.movingframe = f;
  }

  smoothsteptanh(x: number) {
    if(x < 0.0) return 0;
    else if(x > 1.0) return 1;

    return (Math.tanh(10 * (x - 0.5)) + 1) / 2;
  }
  
  smoothstepatanh(x: number) {
    if(x < 0.0) return 0;
    else if(x > 1.0) return 1;

    return (Math.atanh(2*x - 1)/10) + 0.5;
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
        this.x = this.targetx + (this.beforex - this.targetx) * this.smoothsteptanh(this.movingframe / this.moveframetime);
        this.y = this.targety + (this.beforey - this.targety) * this.smoothsteptanh(this.movingframe / this.moveframetime);
        this.img.setX(this.x);
        this.img.setY(this.y);
        //console.log(this.x+","+this.y);
      }
    }
  }
}